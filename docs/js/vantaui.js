/* ============================================================
   VantaUI — optional behaviours (zero dependencies).
   The CSS is fully usable without this file. Load it only if you want
   the interactive niceties below. Works as an ES module or a plain
   <script> (auto-inits on DOMContentLoaded).

     • Tabs    — accessible [role=tablist] / [role=tab] / [role=tabpanel]
                 wiring (click + arrow keys), panels matched by
                 aria-controls or [data-tab].
     • Meters  — animate a .vui-meter / .vui-gauge from 0 to
                 [data-value] (sets the --value custom property).
     • Clock   — live HH:MM:SS into [data-vui-clock].

   API:  VantaUI.init(root?)  ·  VantaUI.setValue(el, n)  ·  VantaUI.tabs(root?)  ·  VantaUI.tooltips(root?)
   ============================================================ */

const isBrowser = typeof document !== 'undefined';

/* ---------- Tabs ---------- */
export function tabs(root = document) {
  root.querySelectorAll('[role="tablist"]').forEach(list => {
    if (list.dataset.vuiTabsReady) return;
    list.dataset.vuiTabsReady = '1';
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
  const els = root.querySelectorAll('[data-vui-clock]');
  if (!els.length) return;
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const d = new Date();
    const t = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    els.forEach(el => (el.textContent = t));
  };
  tick();
  clearInterval(window.__vuiClock);
  window.__vuiClock = setInterval(tick, 1000);
}

/* ---------- Tooltips ---------- */
export function tooltips(root = document) {
  let tip = document.getElementById('vui-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'vui-tooltip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
  }

  const show = el => {
    tip.textContent = el.dataset.tip;
    const r = el.getBoundingClientRect();
    tip.style.left = (r.left + r.width / 2) + 'px';
    tip.style.top = r.top + 'px';
    tip.classList.add('is-visible');
  };

  const hide = () => tip.classList.remove('is-visible');

  root.querySelectorAll('[data-tip]').forEach(el => {
    if (el.classList.contains('vui-tip-js')) return;
    el.classList.add('vui-tip-js');
    el.addEventListener('mouseenter', () => show(el));
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focusin', () => show(el));
    el.addEventListener('focusout', hide);
  });
}

/* ---------- Dialogs & Drawer Toggles ---------- */
export function drawers(root = document) {
  const targetEl = root.documentElement || root;
  if (targetEl.dataset.vuiDrawersReady) return;
  targetEl.dataset.vuiDrawersReady = '1';

  root.addEventListener('click', e => {
    // 1. Trigger Open
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const targetId = opener.getAttribute('data-open');
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        if (typeof target.showModal === 'function') {
          target.showModal();
        } else {
          target.classList.add('active', 'open');
        }
      }
      return;
    }

    // 2. Trigger Close
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const dlg = closer.closest('dialog');
      if (dlg) {
        e.preventDefault();
        dlg.close();
      } else {
        const drawer = closer.closest('.drawer');
        if (drawer) {
          e.preventDefault();
          drawer.classList.remove('active', 'open');
        }
      }
      return;
    }

    // 3. Backdrop click closes the dialog (modals + edge drawers alike).
    //    A click on the ::backdrop reports the <dialog> itself as the target;
    //    we confirm the pointer fell outside the dialog's box so clicks on
    //    inner padding never dismiss it. Opt out with [data-no-dismiss].
    if (e.target.tagName === 'DIALOG' && e.target.open && !e.target.hasAttribute('data-no-dismiss')) {
      const r = e.target.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      if (!inside) {
        e.target.close();
        return;
      }
    }

    // 4. Click outside non-dialog drawer closes it
    if (!e.target.closest('.drawer')) {
      document.querySelectorAll('.drawer.active, .drawer.open').forEach(drawer => {
        drawer.classList.remove('active', 'open');
      });
    }

    // 5. Drawer/Dialog link click closes the drawer
    const link = e.target.closest('.drawer a, dialog.left nav a, dialog.right nav a');
    if (link) {
      const dlg = link.closest('dialog');
      if (dlg) {
        setTimeout(() => dlg.close(), 80);
      } else {
        const drawer = link.closest('.drawer');
        if (drawer) {
          setTimeout(() => drawer.classList.remove('active', 'open'), 80);
        }
      }
    }
  });
}

/* ---------- Dropdown menus (<details class="dropdown">) ---------- */
export function menus(root = document) {
  const hasPopover = typeof HTMLElement.prototype.showPopover === 'function';

  // Upgrade <details.dropdown> panels to the Popover top layer so they escape
  // any overflow / clip-path boundaries. popover="auto" also gives light-dismiss,
  // Esc, and exclusive-open for free.
  // Runs on every menus() call (idempotent: skips already-upgraded panels) so
  // dynamically rendered dropdowns are caught even on subsequent init() calls.
  if (hasPopover) {
    (root === document ? document : root).querySelectorAll('.vui details.dropdown').forEach(details => {
      const panel = details.querySelector(':scope > menu, :scope > nav, :scope > ul');
      const summary = details.querySelector(':scope > summary');
      if (!panel || !summary || panel.hasAttribute('popover')) return;

      panel.setAttribute('popover', 'auto');
      panel.classList.add('menu');

      // Position the panel below its trigger via getBoundingClientRect.
      // JS inline styles override any CSS positioning (including position-area),
      // so this works reliably in all browsers with the Popover API.
      const placePanel = () => {
        const r = summary.getBoundingClientRect();
        panel.style.top = (r.bottom + 6) + 'px';
        if (details.classList.contains('right')) {
          panel.style.left = '';
          panel.style.right = (window.innerWidth - r.right) + 'px';
        } else {
          panel.style.right = '';
          panel.style.left = r.left + 'px';
        }
      };

      // Drive state via Popover API; prevent <details> native toggle.
      summary.addEventListener('click', e => {
        e.preventDefault();
        if (panel.matches(':popover-open')) {
          panel.hidePopover();
        } else {
          panel.showPopover();
          placePanel();
        }
      });

      // Sync <details open> for CSS trigger/chevron styling.
      panel.addEventListener('toggle', e => {
        if (e.newState === 'open') details.setAttribute('open', '');
        else details.removeAttribute('open');
      });
    });
  }

  // Event listeners are registered only once per root (guard below).
  const target = root.documentElement || root;
  if (target.dataset.vuiMenusReady) return;
  target.dataset.vuiMenusReady = '1';

  // Fallback handlers for <details> path (browsers without Popover API).
  // Only one dropdown open at a time. `toggle` doesn't bubble, so capture it.
  document.addEventListener(
    'toggle',
    e => {
      const d = e.target;
      if (d.matches && d.matches('details.dropdown') && d.open) {
        document.querySelectorAll('details.dropdown[open]').forEach(o => {
          if (o !== d) o.open = false;
        });
      }
    },
    true,
  );

  document.addEventListener('click', e => {
    // outside click closes every open dropdown
    if (!e.target.closest('details.dropdown')) {
      document.querySelectorAll('details.dropdown[open]').forEach(o => (o.open = false));
      return;
    }
    // choosing an item closes its dropdown (let the activation happen first)
    const item = e.target.closest('details.dropdown a, details.dropdown button');
    if (item && !e.target.closest('summary')) {
      const d = item.closest('details.dropdown');
      if (d) setTimeout(() => (d.open = false), 80);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('details.dropdown[open]');
    if (!open) return;
    open.open = false;
    const summary = open.querySelector(':scope > summary');
    if (summary) summary.focus();
  });
}

/* ---------- Toolbars: roving tabindex for [role="toolbar"] ---------- */
export function toolbars(root = document) {
  root.querySelectorAll('[role="toolbar"]').forEach(bar => {
    if (bar.dataset.vuiToolbarReady) return;
    bar.dataset.vuiToolbarReady = '1';

    const items = () =>
      [...bar.querySelectorAll('button, a[href], select, [tabindex]')].filter(
        el => !el.disabled && el.offsetParent !== null,
      );

    const setStop = active => items().forEach(el => (el.tabIndex = el === active ? 0 : -1));

    const list = items();
    if (list.length) setStop(list[0]);

    bar.addEventListener('keydown', e => {
      const vertical = bar.classList.contains('vertical');
      const fwd = vertical ? 'ArrowDown' : 'ArrowRight';
      const back = vertical ? 'ArrowUp' : 'ArrowLeft';
      const cur = items();
      const i = cur.indexOf(document.activeElement);
      if (i === -1) return;
      let n;
      if (e.key === fwd) n = (i + 1) % cur.length;
      else if (e.key === back) n = (i - 1 + cur.length) % cur.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = cur.length - 1;
      else return;
      e.preventDefault();
      setStop(cur[n]);
      cur[n].focus();
    });

    // keep the most recently focused control as the single tab stop
    bar.addEventListener('focusin', e => {
      if (items().includes(e.target)) setStop(e.target);
    });
  });
}

/* ---------- Toast / snackbar ---------- */
function ensureToaster(placement) {
  let region = document.querySelector('.vui.toaster, .vui .toaster');
  if (!region) {
    region = document.createElement('div');
    region.className = 'vui toaster' + (placement ? ' ' + placement : '');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'false');
    document.body.appendChild(region);
  }
  return region;
}

export function toast(message, options = {}) {
  if (!isBrowser) return null;
  if (typeof options === 'string') options = {tone: options};
  const {
    tone = '',
    title = '',
    duration = 4000,
    role = 'status',
    dismissible = true,
    placement = '',
  } = options;

  const region = ensureToaster(placement);
  const el = document.createElement('div');
  el.className = 'toast' + (tone ? ' ' + tone : '');
  el.setAttribute('role', role === 'alert' ? 'alert' : 'status');

  const body = document.createElement('div');
  if (title) {
    const strong = document.createElement('strong');
    strong.textContent = title;
    body.appendChild(strong);
  }
  body.appendChild(document.createTextNode(message == null ? '' : String(message)));
  el.appendChild(body);

  let timer;
  const dismiss = () => {
    if (el.dataset.leaving) return;
    el.dataset.leaving = '1';
    clearTimeout(timer);
    el.classList.add('is-leaving');
    const done = () => el.remove();
    el.addEventListener('animationend', done, {once: true});
    setTimeout(done, 400);
  };

  if (dismissible) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon small';
    btn.setAttribute('aria-label', 'Dismiss');
    btn.setAttribute('data-close', '');
    btn.innerHTML = '<i>close</i>';
    btn.addEventListener('click', dismiss);
    el.appendChild(btn);
  }

  region.appendChild(el);
  if (duration > 0) timer = setTimeout(dismiss, duration);

  return {el, dismiss};
}

/* ---------- Init everything ---------- */
export function init(root = document) {
  if (!isBrowser) return;
  tabs(root);
  animateOnView(root);
  clocks(root);
  drawers(root);
  tooltips(root);
  menus(root);
  toolbars(root);
}

const VantaUI = {init, tabs, setValue, drawers, tooltips, menus, toolbars, toast};
export default VantaUI;

if (isBrowser) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }
  window.vui = VantaUI;
}
