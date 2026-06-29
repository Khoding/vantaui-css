/* ============================================================
   VantaUI dev linter — live "bad HTML / bad combination" hints.

   A DEVELOPMENT-ONLY companion: it walks the rendered DOM and flags the
   mistakes VantaUI's semantic-first design can't style its way out of —
   structural/a11y slips (two <h1>, a skipped heading level, an <img> with no
   alt, a stray [role="tab"]) and VantaUI helper-word conflicts (two mutually
   exclusive words on one element, e.g. `fill ghost`).

   It is the JS half of the dev tooling; the CSS half (vantaui-css/dev) paints
   the flags. Each offender gets `data-vui-lint="<message>"` (which the dev CSS
   outlines + labels) and a `console.warn(message, node)` you can click to the
   live element. Nothing here runs automatically and nothing ships in the core
   `init()` — you opt in:

     import {lint} from 'vantaui-css/lint';
     lint();                       // one pass over document
     lint(document, {observe:true}); // re-lint on DOM changes (SPA)

   The mutex rules come from js/vantaui-lint-rules.js, generated from the
   catalog (docs/compat-data.js). Structural rules are universal HTML/a11y and
   need no data. A runtime DOM linter can point at the rendered node but cannot
   map back to a framework source line (.vue/.jsx) — that is by design.

   js/vantaui-lint.js is the source of truth; never edit a generated build of it.
   ============================================================ */
import {MUTEX_GROUPS} from './vantaui-lint-rules.js';

const isBrowser = typeof document !== 'undefined';
const ATTR = 'data-vui-lint';

// One observer per root so observe:true is idempotent.
const observers = new WeakMap();

function flag(node, message, found) {
  if (node.getAttribute(ATTR)) return; // first finding per node wins the label
  node.setAttribute(ATTR, message);
  found.push({node, message});
  console.warn('[vui-lint] ' + message, node);
}

/** Remove all lint markers under `root` (does not touch console output). */
export function clear(root = document) {
  if (!isBrowser) return;
  const scope = root.nodeType ? root : document;
  scope.querySelectorAll('[' + ATTR + ']').forEach(n => n.removeAttribute(ATTR));
}

/**
 * Lint the DOM under `root`. Returns the list of findings ({node, message}).
 * @param {Node} [root=document]
 * @param {{observe?:boolean}} [opts]
 */
export function lint(root = document, opts = {}) {
  if (!isBrowser) return [];
  const scope = root.nodeType ? root : document;
  const q = sel => Array.from(scope.querySelectorAll(sel));
  const found = [];
  clear(scope);

  // --- Structural / a11y (universal, no catalog data) ---

  // More than one top-level heading.
  const h1s = q('h1');
  if (h1s.length > 1) {
    h1s.slice(1).forEach(h => flag(h, 'Multiple <h1> on the page — use a single top-level heading.', found));
  }

  // Skipped heading level (e.g. h2 followed by h4) in document order.
  let prev = 0;
  q('h1, h2, h3, h4, h5, h6').forEach(h => {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) {
      flag(h, `Heading level skipped (h${prev} → h${lvl}) — don't jump levels.`, found);
    }
    prev = lvl;
  });

  // Images without an alt attribute (decorative images still need alt="").
  q('img:not([alt])').forEach(img => flag(img, '<img> is missing an alt attribute (use alt="" if decorative).', found));

  // A tab outside its tablist has no keyboard semantics.
  q('[role="tab"]').forEach(t => {
    if (!t.closest('[role="tablist"]')) {
      flag(t, '[role="tab"] is not inside a [role="tablist"].', found);
    }
  });

  // --- VantaUI helper-word conflicts (catalog-derived) ---
  // Only inside a .vui scope, where the helper words mean something.
  q('[class]').forEach(node => {
    if (!node.closest('.vui')) return;
    const list = node.classList;
    for (const group of MUTEX_GROUPS) {
      const hits = group.filter(w => list.contains(w));
      if (hits.length >= 2) {
        flag(node, `Conflicting helper words "${hits.join(' ')}" on one element — pick one.`, found);
        break; // one conflict message per node is enough
      }
    }
  });

  // --- Optional live mode for SPAs ---
  if (opts.observe && window.MutationObserver && !observers.has(scope)) {
    let queued = false;
    const obs = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        lint(scope); // re-pass; observer already registered, so no re-arm
      });
    });
    const target = scope.nodeType === 9 ? scope.documentElement : scope;
    obs.observe(target, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
    observers.set(scope, obs);
  }

  return found;
}

/** Stop live linting started with observe:true and clear markers. */
export function stop(root = document) {
  if (!isBrowser) return;
  const scope = root.nodeType ? root : document;
  const obs = observers.get(scope);
  if (obs) {
    obs.disconnect();
    observers.delete(scope);
  }
  clear(scope);
}

const VantaUILint = {lint, clear, stop};
if (isBrowser) window.vuiLint = lint;
export default VantaUILint;
