/* ============================================================
   VantaUI — horizontal-overflow audit (Playwright).
   Serves docs/ over HTTP and drives headless Chromium across a
   viewport matrix, hunting for elements whose right edge pokes past
   the viewport — the page-level horizontal overflow that drags a
   scrollbar onto the whole shell.

   It special-cases the "blind clip": an offender that is hidden from
   the eye because an ancestor carries a `clip-path` (which clips PAINT
   but not the scroll box), so the overflow scrolls the page invisibly.

   Intended scrollers (a .scroll/.table-scroll wrapper, <pre>, a
   carousel, anything with computed overflow-x auto/scroll/hidden/clip)
   CONTAIN their content and are not reported. A clip-path alone does
   NOT contain — that is the whole bug.

     node scripts/audit-overflow.mjs                 # docs fixtures
     node scripts/audit-overflow.mjs --url http://localhost:5173/people
     node scripts/audit-overflow.mjs --json tmp/overflow.json

   Exit code is non-zero when any offender is found (CI gate).
   ============================================================ */
import {createServer} from 'node:http';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {extname, join, resolve, dirname} from 'node:path';
import {chromium} from 'playwright';

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf('--' + name);
  return i !== -1 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : def;
};

// Pages served from docs/ to audit (relative paths), unless --url overrides.
const DEFAULT_PAGES = ['/index.html', '/overflow-fixture.html'];
const externalUrl = flag('url', null);
const jsonOut = flag('json', null);
// Viewport matrix: 250 is the support floor; the rest cover phones → desktop.
const WIDTHS = [250, 280, 320, 360, 414, 768, 1024, 1280];
const HEIGHT = 900;

const DOCS = resolve(process.cwd(), 'docs');
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

// ---- The in-page detector (runs in the browser) ----
// The symptom that hurts is the STAGE scrolling sideways: <main> (or, on a
// frameless page, <body>/<html>) showing `scrollWidth > clientWidth` drags a
// phantom scrollbar across the whole shell. So we look only at those stage
// scrollers, then dig out the leaf content that escaped to them.
//
// Crucially we distinguish two kinds of ancestor:
//   • a real OVERFLOW boundary (computed overflow-x clip/hidden/auto/scroll, or
//     a sanctioned self-scroller) CONTAINS its content — overflow stops there;
//   • a `clip-path` only clips PAINT — overflow sails straight through it.
// A leaf is reported only if NOTHING contains it between itself and the stage;
// it is tagged blindClip when a clip-path is why it's invisible.
function detect() {
  const tol = 2; // ignore sub-pixel / border rounding
  const ALLOW = 'pre, textarea, [class~="scroll"], [class~="table-scroll"], [class~="vui-overflow-auto"], [class*="carousel"], [class*="snap"]';

  const sel = el => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && parts.length < 5) {
      let p = n.tagName.toLowerCase();
      if (n.id) {
        p += '#' + n.id;
        parts.unshift(p);
        break;
      }
      const cls = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3);
      if (cls.length) p += '.' + cls.join('.');
      parts.unshift(p);
      n = n.parentElement;
    }
    return parts.join(' > ');
  };

  const isAllowed = el => el.matches(ALLOW) || el.closest(ALLOW) !== null;
  const contains = el => {
    const ox = getComputedStyle(el).overflowX;
    return ox === 'clip' || ox === 'hidden' || ox === 'auto' || ox === 'scroll' || el.matches(ALLOW);
  };

  // Stage scrollers that should never scroll the inline axis.
  const stages = [...new Set([document.documentElement, document.body, ...document.querySelectorAll('main')])]
    .filter(s => s && s.scrollWidth - s.clientWidth > tol && !isAllowed(s));

  const offenders = [];
  for (const container of stages) {
    const cr = container.getBoundingClientRect();
    const rightEdge = cr.left + container.clientWidth; // content right edge
    // Descendants that genuinely overflow (box pokes past the stage edge, OR own
    // text scrolls inside a block box) and are NOT contained by an overflow
    // boundary somewhere between themselves and the stage.
    const poking = Array.from(container.querySelectorAll('*')).filter(d => {
      if (isAllowed(d)) return false;
      const dr = d.getBoundingClientRect();
      if (dr.width <= 0 || dr.height <= 0) return false;
      // Box pokes past the stage edge, OR its own text scrolls inside it — but
      // only count own-scroll when d does NOT contain it (else it never escapes).
      const overflows = dr.right > rightEdge + tol || (d.scrollWidth - d.clientWidth > tol && !contains(d));
      if (!overflows) return false;
      // Is anything between d and the stage a real overflow boundary? If so the
      // overflow is contained there and never reached this stage through d.
      let a = d;
      while (a && a !== container) {
        if (a !== d && contains(a)) return false;
        a = a.parentElement;
      }
      return true;
    });
    // Reduce to leaf-most pokers (drop any that contain another poker).
    const pokeSet = new Set(poking);
    const leaves = poking.filter(d => !Array.from(d.querySelectorAll('*')).some(c => pokeSet.has(c)));
    if (!leaves.length) continue;

    for (const leaf of leaves) {
      // Is the leaf hidden by an ancestor clip-path between it and the container?
      let blindClip = false;
      let clipAncestor = null;
      let a = leaf;
      while (a && a !== container.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.clipPath && cs.clipPath !== 'none') {
          blindClip = true;
          clipAncestor = a;
        }
        a = a.parentElement;
      }
      const lcs = getComputedStyle(leaf);
      const lr = leaf.getBoundingClientRect();
      offenders.push({
        container: sel(container),
        scrolls: container.scrollWidth - container.clientWidth,
        leaf: sel(leaf),
        blindClip,
        clipAncestor: clipAncestor ? sel(clipAncestor) : null,
        overshoot: Math.round(Math.max(lr.right - rightEdge, leaf.scrollWidth - leaf.clientWidth)),
        clipPath: lcs.clipPath === 'none' ? null : lcs.clipPath.slice(0, 40),
        whiteSpace: lcs.whiteSpace,
        minInlineSize: lcs.minInlineSize ?? lcs.minWidth,
        position: lcs.position,
        overflowX: lcs.overflowX,
      });
    }
  }
  const docScroll = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return {offenders, docScroll, viewport: document.documentElement.clientWidth};
}

// ---- Harness ----
let serverBase = null;
let server = null;
if (!externalUrl) {
  server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const data = await readFile(join(DOCS, p));
      res.writeHead(200, {'content-type': MIME[extname(p)] || 'application/octet-stream'});
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  });
  await new Promise(r => server.listen(0, r));
  serverBase = `http://localhost:${server.address().port}`;
}

const targets = externalUrl ? [externalUrl] : DEFAULT_PAGES.map(p => serverBase + p);

const browser = await chromium.launch();
const results = [];
let totalOffenders = 0;

for (const url of targets) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({viewport: {width, height: HEIGHT}});
    await page.goto(url, {waitUntil: 'networkidle'}).catch(() => {});
    await page.waitForTimeout(250);
    const {offenders, docScroll} = await page.evaluate(detect);
    await page.close();
    if (offenders.length || docScroll > 1) {
      results.push({url, width, docScroll, offenders});
      totalOffenders += offenders.length;
    }
  }
}

await browser.close();
if (server) await new Promise(r => server.close(r));

// ---- Report ----
if (!results.length) {
  console.log('✓ No horizontal overflow across', WIDTHS.join('/'), 'px on', targets.length, 'page(s).');
} else {
  for (const {url, width, docScroll, offenders} of results) {
    console.log(`\n✗ ${url} @ ${width}px — page scrolls ${docScroll}px horizontally`);
    if (!offenders.length) {
      console.log('    (overflow present but no uncontained leaf isolated — inspect manually)');
    }
    for (const o of offenders) {
      const tag = o.blindClip ? ' [BLIND CLIP — hidden by ancestor clip-path]' : '';
      console.log(`    • ${o.container}  scrolls ${o.scrolls}px${tag}`);
      console.log(`        leaf: ${o.leaf}  (+${o.overshoot}px past container)`);
      if (o.blindClip) console.log(`        hidden by clip-path on: ${o.clipAncestor}`);
      console.log(`        white-space:${o.whiteSpace}  min-inline:${o.minInlineSize}  overflow-x:${o.overflowX}  pos:${o.position}`);
    }
  }
  console.log(`\n${totalOffenders} offender(s) across ${results.length} viewport(s).`);
}

if (jsonOut) {
  await mkdir(dirname(resolve(String(jsonOut))), {recursive: true});
  await writeFile(resolve(String(jsonOut)), JSON.stringify({widths: WIDTHS, results}, null, 2));
  console.log('wrote', jsonOut);
}

process.exit(results.length ? 1 : 0);
