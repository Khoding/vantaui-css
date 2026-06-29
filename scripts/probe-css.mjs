/* ============================================================
   VantaUI — CSS-truth probe (Playwright).

   Renders every catalogued component headless against the REAL built
   stylesheet (dist/vantaui.css) and reads getComputedStyle to establish
   what the CSS actually does, instead of trusting the hand-curated prose.
   It is the machine-owned half of the compatibility catalog: the prose
   (names, intent, notes) stays in docs/compat-data.js; the structural
   facts below are derived and regenerated freely.

   What it derives, per component:
     • helperEffects  which computed properties each helper word changes
     • mutexGroups    helper pairs that are mutually exclusive IN EFFECT
                      (base+A+B resolves to exactly base+A or base+B —
                      one simply wins, so they cannot coexist)
     • knobs          whether each declared --knob is actually consumed,
                      and which properties it moves
   Plus a repo-wide drift diff (the "name gate" seed):
     • cssClasses / cssKnobs   the real universe scanned from the src tree
     • missingInCss            catalog words with no matching CSS rule
     • undocumentedHelpers     catalog has them, CSS never sets them

   Seeded from docs/compat-data.js (triggers, helper words, knobs): the
   catalog supplies the candidate taxonomy and the human names; the probe
   supplies the verified behaviour. Components whose trigger needs richer
   internal structure than a bare element (table rows, tablists…) are
   probed best-effort and tagged low-confidence.

     node scripts/probe-css.mjs                 # writes docs/compat-facts.json
     node scripts/probe-css.mjs --json out.json
     node scripts/probe-css.mjs --debug         # keep the fixture page open path

   Claude Generated, verified by hand.
   ============================================================ */
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
import {scanUniverse, classifyHelper} from './lib/css-universe.mjs';

const root = process.cwd();
const srcDir = resolve(root, 'src');
const distCss = resolve(root, 'dist', 'vantaui.css');
const compatData = resolve(root, 'docs', 'compat-data.js');

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf('--' + name);
  if (i === -1) return def;
  return args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
};
const jsonOut = resolve(String(flag('json', resolve(root, 'docs', 'compat-facts.json'))));

/* ---- Computed properties we sample. A component's visual identity lives
   here; keep it broad enough to catch a helper's effect, tight enough that
   the JSON stays readable. ---- */
const PROBE_PROPS = [
  'backgroundColor', 'backgroundImage', 'color', 'opacity', 'filter', 'backdropFilter',
  'borderTopColor', 'borderTopWidth', 'borderTopStyle',
  'borderLeftColor', 'borderLeftWidth',
  'boxShadow', 'outlineColor', 'outlineWidth',
  'clipPath', 'borderRadius',
  'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight',
  'marginTop', 'marginLeft',
  'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
  'gridTemplateColumns',
  'fontSize', 'fontWeight', 'fontFamily', 'textTransform', 'letterSpacing', 'textAlign',
  'position', 'width', 'minWidth', 'height', 'transform',
];

/* ============================================================
   1. Trigger parsing (catalog prose -> real DOM). The universe scan and
      helper classification are shared with the build via ./lib/css-universe.
   ============================================================ */
// Pull the first concrete construct out of a prose trigger string.
function parseTrigger(trigger) {
  const seg = trigger.split(/·|\s\/\s|\//)[0].trim(); // first alternative
  const tagM = seg.match(/<([a-zA-Z][a-zA-Z0-9]*)/);
  const classAttrM = seg.match(/class="([^"]+)"/);
  const leadClassM = seg.match(/^\.([\w-]+)/);
  const roleM = seg.match(/role="([^"]+)"/);
  const tag = tagM ? tagM[1] : leadClassM ? 'div' : roleM ? 'div' : null;
  const classes = [];
  if (classAttrM) classes.push(...classAttrM[1].split(/\s+/));
  if (leadClassM) classes.push(leadClassM[1]);
  const attrs = {};
  if (roleM) attrs.role = roleM[1];
  if (!tag) return null; // unparseable
  return {tag, classes, attrs};
}

/* ============================================================
   2. Build the fixture spec the page will stamp out
   ============================================================ */
function buildSpec(components) {
  const spec = [];
  const skipped = [];
  for (const c of components) {
    const base = parseTrigger(c.trigger);
    if (!base) {
      skipped.push({id: c.id, reason: 'unparseable trigger', trigger: c.trigger});
      continue;
    }
    const classHelpers = [];
    const attrHelpers = [];
    for (const h of c.helpers || []) {
      const cl = classifyHelper(h.word);
      if (cl.kind === 'class') classHelpers.push(cl.word);
      else if (cl.kind === 'attr') attrHelpers.push(cl);
    }
    spec.push({
      id: c.id,
      base,
      classHelpers,
      attrHelpers,
      knobs: (c.knobs || []).map(k => k.name).filter(n => !n.startsWith('--_')),
      combines: c.combines || [],
    });
  }
  return {spec, skipped};
}

/* ============================================================
   4. The in-page worker. Stamps elements, reads computed styles,
      returns the raw measurements; all derivation happens in node.
   ============================================================ */
function measureAll({spec, PROBE_PROPS}) {
  const host = document.getElementById('host');
  const read = el => {
    const cs = getComputedStyle(el);
    const o = {};
    for (const p of PROBE_PROPS) o[p] = cs[p];
    return o;
  };
  // Construct an element from a base spec, without inserting it.
  const el = (base, extraClasses = [], attrs = {}, style = '') => {
    const node = document.createElement(base.tag);
    for (const cl of base.classes) node.classList.add(cl);
    for (const cl of extraClasses) node.classList.add(cl);
    for (const [k, v] of Object.entries(base.attrs)) node.setAttribute(k, v);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (style) node.setAttribute('style', style);
    node.textContent = 'Probe content';
    return node;
  };
  // Stamp a single element straight into the host and return it.
  const make = (s, extraClasses = [], attrs = {}, style = '') => {
    const node = el(s.base, extraClasses, attrs, style);
    host.appendChild(node);
    return node;
  };

  const baseById = Object.fromEntries(spec.map(s => [s.id, s.base]));
  const out = {};
  for (const s of spec) {
    const comp = {base: null, helpers: {}, combos: {}, knobs: {}, combines: {}};
    const baseEl = make(s);
    comp.base = read(baseEl);

    // single helper effects
    for (const w of s.classHelpers) {
      const el = make(s, [w]);
      comp.helpers[w] = read(el);
    }
    // attribute helpers (effect only; not part of mutex combos)
    for (const a of s.attrHelpers) {
      const el = make(s, [], {[a.name]: a.value});
      comp.helpers[a.name] = read(el);
    }
    // pairwise combos for mutex detection (class helpers only)
    for (let i = 0; i < s.classHelpers.length; i++) {
      for (let j = i + 1; j < s.classHelpers.length; j++) {
        const a = s.classHelpers[i];
        const b = s.classHelpers[j];
        const el = make(s, [a, b]);
        comp.combos[a + '|' + b] = read(el);
      }
    }
    // knob effects: two contrasting value families so length- AND colour-typed
    // knobs both reveal themselves.
    for (const k of s.knobs) {
      const len = make(s, [], {}, `${k}: 40px`);
      const col = make(s, [], {}, `${k}: rgb(255, 0, 255)`);
      comp.knobs[k] = {len: read(len), col: read(col)};
    }
    // combines: render each catalogued partner B nested INSIDE this component A
    // and measure B. Compared in node against B's standalone base, a delta means
    // A genuinely restyles a nested B (a real edge), not just an aesthetic pairing.
    for (const cid of s.combines) {
      const childBase = baseById[cid];
      if (!childBase || cid === s.id) continue;
      const parent = el(s.base);
      parent.textContent = '';
      const child = el(childBase);
      parent.appendChild(child);
      host.appendChild(parent);
      comp.combines[cid] = read(child);
    }
    out[s.id] = comp;
  }
  return out;
}

/* ============================================================
   5. Derivation (runs in node over the raw measurements)
   ============================================================ */
function diffProps(a, b) {
  const changed = {};
  for (const k of Object.keys(a)) if (a[k] !== b[k]) changed[k] = {from: a[k], to: b[k]};
  return changed;
}
function sameOn(a, b, keys) {
  return keys.every(k => a[k] === b[k]);
}

// Emergent box dimensions shift for many reasons (padding, content, a sibling
// border), so two helpers both nudging width/height is NOT proof they are
// mutually exclusive. Mutex is decided on IDENTITY properties only; these are
// dropped from the contested set. Size helpers still register via fontSize /
// borderRadius / padding, so real size groups survive.
const NON_IDENTITY = new Set(['width', 'height', 'minWidth']);

// Union-find: collapse a list of mutually-exclusive pairs into groups.
function groupPairs(pairs) {
  const parent = new Map();
  const find = x => {
    if (!parent.has(x)) parent.set(x, x);
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  };
  const union = (a, b) => parent.set(find(a), find(b));
  for (const [a, b] of pairs) union(a, b);
  const groups = new Map();
  for (const x of parent.keys()) {
    const r = find(x);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(x);
  }
  return [...groups.values()].map(g => g.sort());
}

function derive(raw, spec, propReads, kindsByComp) {
  const reads = new Set(propReads);
  const facts = {};
  for (const s of spec) {
    const m = raw[s.id];
    if (!m) continue;
    const base = m.base;
    const kindOf = kindsByComp[s.id] || {};

    // helper effects: which props each helper moved off base
    const helperEffects = {};
    for (const [w, snap] of Object.entries(m.helpers)) {
      helperEffects[w] = Object.keys(diffProps(base, snap));
    }

    // mutex (rigorous): A and B are mutually exclusive only if they BOTH move
    // the SAME property (the contested set is their effect INTERSECTION), the
    // two disagree on it, and applied together the combo collapses to exactly
    // one side. Using the intersection (not the union) means a helper that is a
    // no-op in this fixture can never manufacture a false conflict.
    const samePairs = []; // same-kind, true exclusion: the real "pick one" sets
    const crossKindCollisions = []; // share a prop / one wins, but otherwise coexist
    for (const [pair, comboSnap] of Object.entries(m.combos)) {
      const [a, b] = pair.split('|');
      const aSnap = m.helpers[a];
      const bSnap = m.helpers[b];
      if (!aSnap || !bSnap) continue;
      const effA = new Set(helperEffects[a] || []);
      const contested = (helperEffects[b] || []).filter(p => effA.has(p) && !NON_IDENTITY.has(p));
      if (!contested.length) continue; // they don't touch the same identity prop
      if (sameOn(aSnap, bSnap, contested)) continue; // they agree, no conflict
      const equalsA = sameOn(comboSnap, aSnap, contested);
      const equalsB = sameOn(comboSnap, bSnap, contested);
      if (!equalsA && !equalsB) continue; // they blend, neither wins outright
      const winner = equalsA ? a : b;
      const loser = equalsA ? b : a;
      // True mutex needs the loser FULLY suppressed: every identity prop it
      // moves is one the winner overrode. If the loser keeps unique props (like
      // a floating header that loses its shadow to glow but keeps its border),
      // they coexist — that is an override, not an exclusion.
      const loserIdentity = (helperEffects[loser] || []).filter(p => !NON_IDENTITY.has(p));
      const fullySuppressed = loserIdentity.every(p => contested.includes(p));
      if (fullySuppressed && kindOf[a] && kindOf[a] === kindOf[b]) {
        samePairs.push([a, b]);
      } else {
        crossKindCollisions.push({
          pair: [a, b],
          winner,
          over: contested,
          kinds: [kindOf[a] || '?', kindOf[b] || '?'],
          coexists: !fullySuppressed,
        });
      }
    }
    const mutexGroups = groupPairs(samePairs);

    // knobs: a knob is "consumed" if the CSS reads it anywhere (reliable, even
    // for inherited custom props consumed by descendants) OR it moved this
    // element's own computed style. `affects` is the own-element delta only.
    const knobs = {};
    for (const [k, {len, col}] of Object.entries(m.knobs)) {
      const affects = [...new Set([...Object.keys(diffProps(base, len)), ...Object.keys(diffProps(base, col))])];
      knobs[k] = {consumed: affects.length > 0 || reads.has(k), affects};
    }

    // combines: a catalogued pairing is a VERIFIED edge when nesting the partner
    // inside this component actually changes the partner's computed style versus
    // its standalone base. `restyles` lists the props the parent moves; an empty
    // list means the pairing is idiomatic/aesthetic only (no CSS coupling).
    const combines = {};
    for (const [cid, nestedSnap] of Object.entries(m.combines || {})) {
      const childBase = raw[cid] && raw[cid].base;
      if (!childBase) continue;
      // Drop emergent dimensions: a nested child simply has a different
      // available width than a standalone one — that is layout context, not the
      // parent restyling it. What remains (colour, border, type, padding…) is a
      // genuine restyle edge.
      const restyles = Object.keys(diffProps(childBase, nestedSnap)).filter(p => !NON_IDENTITY.has(p));
      // A lone margin shift is usually layout centring (auto margins), not the
      // parent restyling the child — require at least one non-margin property to
      // call the edge verified, but keep margin in the evidence list.
      const verified = restyles.some(p => p !== 'marginTop' && p !== 'marginLeft');
      combines[cid] = {verified, restyles};
    }

    facts[s.id] = {
      noOpHelpers: Object.entries(helperEffects).filter(([, v]) => v.length === 0).map(([w]) => w),
      helperEffects,
      mutexGroups,
      crossKindCollisions,
      knobs,
      combines,
    };
  }
  return facts;
}

/* ============================================================
   6. Harness
   ============================================================ */
function fixtureHtml(cssHref) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="${cssHref}">
</head><body class="vui"><main id="host"></main></body></html>`;
}

async function main() {
  const universe = await scanUniverse(srcDir);
  const {COMPONENTS} = await import(pathToFileURL(compatData).href);
  const {spec, skipped} = buildSpec(COMPONENTS);

  // word -> kind, per component (drives same-kind vs cross-kind mutex split)
  const kindsByComp = {};
  for (const c of COMPONENTS) {
    kindsByComp[c.id] = Object.fromEntries((c.helpers || []).map(h => [h.word, h.kind]));
  }

  // serve dist css + the fixture page
  const server = createServer(async (req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/' || p === '/index.html') {
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(fixtureHtml('/vantaui.css'));
      return;
    }
    if (p === '/vantaui.css') {
      res.writeHead(200, {'content-type': 'text/css'});
      res.end(await readFile(distCss));
      return;
    }
    res.writeHead(404);
    res.end('not found');
  });
  await new Promise(r => server.listen(0, r));
  const baseUrl = `http://localhost:${server.address().port}/`;

  const browser = await chromium.launch();
  const page = await browser.newPage({viewport: {width: 1280, height: 900}});
  await page.goto(baseUrl, {waitUntil: 'networkidle'});
  const raw = await page.evaluate(measureAll, {spec, PROBE_PROPS});
  await browser.close();
  await new Promise(r => server.close(r));

  const facts = derive(raw, spec, universe.cssPropReads, kindsByComp);

  // drift diff (name-gate seed)
  const cssClasses = new Set(universe.cssClasses);
  const catalogClassWords = new Set();
  for (const c of COMPONENTS) {
    for (const h of c.helpers || []) {
      const cl = classifyHelper(h.word);
      if (cl.kind === 'class') catalogClassWords.add(cl.word);
    }
  }
  const missingInCss = [...catalogClassWords].filter(w => !cssClasses.has(w)).sort();

  const out = {
    generatedAt: new Date().toISOString(),
    note: 'GENERATED by scripts/probe-css.mjs. Do not edit by hand. Prose lives in docs/compat-data.js.',
    universe: {
      classCount: universe.cssClasses.length,
      propDefCount: universe.cssPropDefs.length,
      cssClasses: universe.cssClasses,
      cssPropDefs: universe.cssPropDefs,
      cssPropReads: universe.cssPropReads,
    },
    drift: {
      missingInCss, // catalog helper-classes with no matching .class in src
    },
    skipped, // components whose trigger could not be stamped as a bare element
    components: facts,
  };

  await mkdir(dirname(jsonOut), {recursive: true});
  await writeFile(jsonOut, JSON.stringify(out, null, 2));

  // console summary
  const probed = Object.keys(facts).length;
  const groupTotal = Object.values(facts).reduce((n, f) => n + f.mutexGroups.length, 0);
  const crossTotal = Object.values(facts).reduce((n, f) => n + f.crossKindCollisions.length, 0);
  const noOpTotal = Object.values(facts).reduce((n, f) => n + f.noOpHelpers.length, 0);
  console.log(`✓ probed ${probed} component(s), skipped ${skipped.length}`);
  console.log(`  ${groupTotal} mutex group(s) derived, ${crossTotal} cross-kind collision(s) flagged, ${noOpTotal} no-op helper(s)`);
  if (missingInCss.length) console.log(`  ⚠ ${missingInCss.length} catalog class(es) absent from src CSS: ${missingInCss.join(', ')}`);
  if (skipped.length) console.log(`  skipped: ${skipped.map(s => s.id).join(', ')}`);
  console.log(`  wrote ${jsonOut.replace(root, '.')}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
