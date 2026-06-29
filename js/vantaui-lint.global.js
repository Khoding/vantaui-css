/* GENERATED from js/vantaui-lint.js by scripts/build.mjs — do not edit by hand.
   DEV-ONLY dev linter: <script src="vantaui-lint.global.js"> exposes window.vuiLint.
   Never ship to production. Pair with the dev CSS layer (dist/ext/dev.css). */
(() => {
  // js/vantaui-lint-rules.js
  var MUTEX_GROUPS = [
    ["amber", "cyan", "green", "neutral", "red"],
    ["amber", "cyan", "green", "red"],
    ["amber", "danger", "secure"],
    ["bottom", "left", "right"],
    ["busy", "idle", "offline", "online"],
    ["circle", "text"],
    ["columns", "status"],
    ["compact", "relaxed"],
    ["dim", "vivid"],
    ["fill", "ghost"],
    ["flat", "inset", "raised", "stage"],
    ["float", "glow"],
    ["full", "peek"],
    ["hex", "round"],
    ["info", "secure", "threat", "warn"],
    ["large", "small"],
    ["left", "right"],
    ["vui-container--fluid", "vui-container--narrow"],
    ["vui-dot--cyan", "vui-dot--threat", "vui-dot--warn"]
  ];

  // js/vantaui-lint.js
  var isBrowser = typeof document !== "undefined";
  var ATTR = "data-vui-lint";
  var observers = /* @__PURE__ */ new WeakMap();
  function flag(node, message, found) {
    if (node.getAttribute(ATTR)) return;
    node.setAttribute(ATTR, message);
    found.push({ node, message });
    console.warn("[vui-lint] " + message, node);
  }
  function clear(root = document) {
    if (!isBrowser) return;
    const scope = root.nodeType ? root : document;
    scope.querySelectorAll("[" + ATTR + "]").forEach((n) => n.removeAttribute(ATTR));
  }
  function lint(root = document, opts = {}) {
    if (!isBrowser) return [];
    const scope = root.nodeType ? root : document;
    const q = (sel) => Array.from(scope.querySelectorAll(sel));
    const found = [];
    clear(scope);
    const h1s = q("h1");
    if (h1s.length > 1) {
      h1s.slice(1).forEach((h) => flag(h, "Multiple <h1> on the page \u2014 use a single top-level heading.", found));
    }
    let prev = 0;
    q("h1, h2, h3, h4, h5, h6").forEach((h) => {
      const lvl = Number(h.tagName[1]);
      if (prev && lvl > prev + 1) {
        flag(h, `Heading level skipped (h${prev} \u2192 h${lvl}) \u2014 don't jump levels.`, found);
      }
      prev = lvl;
    });
    q("img:not([alt])").forEach((img) => flag(img, '<img> is missing an alt attribute (use alt="" if decorative).', found));
    q('[role="tab"]').forEach((t) => {
      if (!t.closest('[role="tablist"]')) {
        flag(t, '[role="tab"] is not inside a [role="tablist"].', found);
      }
    });
    q("[class]").forEach((node) => {
      if (!node.closest(".vui")) return;
      const list = node.classList;
      for (const group of MUTEX_GROUPS) {
        const hits = group.filter((w) => list.contains(w));
        if (hits.length >= 2) {
          flag(node, `Conflicting helper words "${hits.join(" ")}" on one element \u2014 pick one.`, found);
          break;
        }
      }
    });
    if (opts.observe && window.MutationObserver && !observers.has(scope)) {
      let queued = false;
      const obs = new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          lint(scope);
        });
      });
      const target = scope.nodeType === 9 ? scope.documentElement : scope;
      obs.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
      observers.set(scope, obs);
    }
    return found;
  }
  function stop(root = document) {
    if (!isBrowser) return;
    const scope = root.nodeType ? root : document;
    const obs = observers.get(scope);
    if (obs) {
      obs.disconnect();
      observers.delete(scope);
    }
    clear(scope);
  }
  var VantaUILint = { lint, clear, stop };
  if (isBrowser) window.vuiLint = lint;
  var vantaui_lint_default = VantaUILint;
})();
