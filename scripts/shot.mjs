/* ============================================================
   VantaUI docs — screenshot helper (Playwright).
   Serves docs/ over HTTP (the docs use ES modules, so file:// is
   blocked by CORS), drives headless Chromium, optionally opens a
   component, and saves a PNG of a section — or the full page.

     node scripts/shot.mjs --id dropdown --out tmp/dropdown.png
     node scripts/shot.mjs --id dropdown --click "#dropdown summary" --out tmp/open.png
     node scripts/shot.mjs --full --out tmp/page.png

   Flags:
     --id <sectionId>   screenshot the element with this id (a docs section)
     --sel <selector>   screenshot the first match (overrides --id)
     --click <selector> click this before shooting (e.g. open a dropdown)
     --out <path>       output PNG (default tmp/shot.png)
     --full             full-page screenshot
     --w / --h          viewport size (default 1280x900)
   ============================================================ */
import {createServer} from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
import {extname, join, resolve, dirname} from 'node:path';
import {chromium} from 'playwright';

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf('--' + name);
  return i !== -1 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : def;
};

const id = flag('id');
const sel = flag('sel', id ? '#' + id : null);
const click = flag('click');
const out = resolve(String(flag('out', 'tmp/shot.png')));
const full = !!flag('full', false);
const width = Number(flag('w', 1280));
const height = Number(flag('h', 900));

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

const server = createServer(async (req, res) => {
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
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width, height}, deviceScaleFactor: 2});
const errors = [];
page.on('console', m => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', e => errors.push(String(e)));

await page.goto(`http://localhost:${port}/`, {waitUntil: 'networkidle'});
console.log('chromium', browser.version());

if (sel) await page.evaluate(s => document.querySelector(s)?.scrollIntoView({block: 'center'}), sel);
if (click) {
  await page.click(click, {timeout: 4000}).catch(e => console.log('click failed:', e.message));
}
// --scroll <selector>: scroll that element ~one slide to the right
const scroll = flag('scroll');
if (scroll) {
  await page.evaluate(s => {
    const el = document.querySelector(s);
    if (el) el.scrollBy({left: el.clientWidth * 0.9, behavior: 'instant'});
  }, String(scroll));
}
await page.waitForTimeout(600);

await mkdir(dirname(out), {recursive: true});
const targetEl = !full && sel ? await page.$(sel) : null;
await (targetEl || page).screenshot({path: out, fullPage: full && !targetEl});

if (errors.length) console.log('page errors:\n  ' + errors.join('\n  '));
console.log('saved', out);

await browser.close();
await new Promise(r => server.close(r));
