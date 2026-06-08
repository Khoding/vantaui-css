/* ============================================================
   BatOS — optional behaviours (zero dependencies).
   The CSS is fully usable without this file. Load it only if you want
   the interactive niceties below. Works as an ES module or a plain
   <script> (auto-inits on DOMContentLoaded).

     • Tabs    — accessible [role=tablist] / [role=tab] / [role=tabpanel]
                 wiring (click + arrow keys), panels matched by
                 aria-controls or [data-tab].
     • Meters  — animate a .batos-meter / .batos-gauge from 0 to
                 [data-value] (sets the --value custom property).
     • Clock   — live HH:MM:SS into [data-batos-clock].

   API:  BatOS.init(root?)  ·  BatOS.setValue(el, n)  ·  BatOS.tabs(root?)
   ============================================================ */

const isBrowser = typeof document !== 'undefined';

/* ---------- Tabs ---------- */
export function tabs(root = document) {
  root.querySelectorAll('[role="tablist"]').forEach(list => {
    if (list.dataset.batosTabsReady) return;
    list.dataset.batosTabsReady = '1';
    const tabEls = [...list.querySelectorAll('[role="tab"]')];

    const panelFor = tab => {
      const id = tab.getAttribute('aria-controls') || tab.dataset.tab;
      return id ? document.getElementById(id) : null;
    };

    const activate = (tab, focus = true) => {
      tabEls.forEach(t => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = panelFor(t);
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    };

    tabEls.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab, false));
      tab.addEventListener('keydown', e => {
        const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        activate(tabEls[(i + dir + tabEls.length) % tabEls.length]);
      });
    });

    if (!tabEls.some(t => t.getAttribute('aria-selected') === 'true')) {
      if (tabEls[0]) activate(tabEls[0], false);
    } else {
      activate(list.querySelector('[aria-selected="true"]'), false);
    }
  });
}

/* ---------- Animated value (meters / gauges) ---------- */
export function setValue(el, target, duration = 600) {
  const max = parseFloat(el.style.getPropertyValue('--max') || el.dataset.max || 100);
  const from = parseFloat(el.style.getPropertyValue('--value')) || 0;
  const to = Math.max(0, Math.min(max, target));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || duration <= 0) {
    el.style.setProperty('--value', String(to));
    return;
  }
  const start = performance.now();
  const step = now => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.style.setProperty('--value', (from + (to - from) * eased).toFixed(2));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function animateOnView(root = document) {
  const targets = root.querySelectorAll('[data-value][data-animate]');
  if (!targets.length) return;
  const reveal = el => setValue(el, parseFloat(el.dataset.value));
  if (!('IntersectionObserver' in window)) {
    targets.forEach(reveal);
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          reveal(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    {threshold: 0.4},
  );
  targets.forEach(el => io.observe(el));
}

/* ---------- Clock ---------- */
function clocks(root = document) {
  const els = root.querySelectorAll('[data-batos-clock]');
  if (!els.length) return;
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const d = new Date();
    const t = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    els.forEach(el => (el.textContent = t));
  };
  tick();
  clearInterval(window.__batosClock);
  window.__batosClock = setInterval(tick, 1000);
}

/* ---------- Init everything ---------- */
export function init(root = document) {
  if (!isBrowser) return;
  tabs(root);
  animateOnView(root);
  clocks(root);
}

const BatOS = {init, tabs, setValue};
export default BatOS;

if (isBrowser) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }
  window.BatOS = BatOS;
}
