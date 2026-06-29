/* ============================================================
   VantaUI — shared CSS-universe scan.

   The set of class names and custom properties the source actually
   defines, plus the catalog-side helpers that map onto them. Used by the
   probe (scripts/probe-css.mjs, to know what to render) and by the build's
   name-gate (scripts/build.mjs, to fail when the catalog names something the
   CSS no longer has). One copy so the two can never drift apart.

   Claude Generated, verified by hand.
   ============================================================ */
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

async function listCss(dir) {
  const out = [];
  for (const ent of await readdir(dir, {withFileTypes: true})) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await listCss(p)));
    else if (ent.name.endsWith('.css')) out.push(p);
  }
  return out;
}

const stripComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

// Every class name, custom-property definition, and custom-property read found
// in the source tree. Regex-level, but sufficient: this codebase authors plain
// selectors and var() reads, not class names hidden in strings.
export async function scanUniverse(srcDir) {
  const files = await listCss(srcDir);
  const classes = new Set();
  const propDefs = new Set();
  const propReads = new Set();
  for (const f of files) {
    const css = stripComments(await readFile(f, 'utf8'));
    for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) classes.add(m[1]);
    for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) propDefs.add(m[1]);
    for (const m of css.matchAll(/var\(\s*(--[\w-]+)/g)) propReads.add(m[1]);
  }
  return {
    cssClasses: [...classes].sort(),
    cssPropDefs: [...propDefs].sort(),
    cssPropReads: [...propReads].sort(),
  };
}

// Classify a catalog helper word by how it attaches to an element. Words with
// "…" are span-range placeholders; words with "=" or a data-/aria- prefix are
// attributes; "role" alone is a stray; everything else is a plain class.
export function classifyHelper(word) {
  if (word.includes('…')) return {kind: 'range', word};
  if (word.includes('="')) {
    const [name, val] = word.split('=');
    return {kind: 'attr', name, value: val.replace(/"/g, '')};
  }
  if (/^(data-|aria-)/.test(word)) {
    return {kind: 'attr', name: word, value: word === 'aria-invalid' ? 'true' : 'x'};
  }
  if (word === 'role') return {kind: 'skip', word};
  return {kind: 'class', word};
}

// The catalog's machine-checkable name surface: the helper words that resolve
// to real classes, and the PUBLIC knob names (--_ internals are skipped).
export function catalogNames(components) {
  const classes = new Set();
  const knobs = new Set();
  for (const c of components) {
    for (const h of c.helpers || []) {
      const cl = classifyHelper(h.word);
      if (cl.kind === 'class') classes.add(cl.word);
    }
    for (const k of c.knobs || []) {
      if (!k.name.startsWith('--_')) knobs.add(k.name);
    }
  }
  return {classes: [...classes], knobs: [...knobs]};
}
