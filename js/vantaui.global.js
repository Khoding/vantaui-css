/* ============================================================
   VantaUI — optional behaviours, classic-script build.
   Same features as js/vantaui.js but as a plain <script> (no module),
   so it works with a simple tag and even over file://:
     <script src="vantaui.global.js"></script>
   Exposes window.vui = { init, tabs, setValue } and auto-inits.
   The CSS is fully usable without this file.
   ============================================================ */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  function tabs(root) {
    root = root || document;
    root.querySelectorAll('[role="tablist"]').forEach(function (list) {
      if (list.dataset.vuiTabsReady) return;
      list.dataset.vuiTabsReady = '1';
      var tabEls = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      var panelFor = function (tab) {
        var id = tab.getAttribute('aria-controls') || tab.dataset.tab;
        return id ? document.getElementById(id) : null;
      };
      var activate = function (tab, focus) {
        tabEls.forEach(function (t) {
          var selected = t === tab;
          t.setAttribute('aria-selected', String(selected));
          t.tabIndex = selected ? 0 : -1;
          var panel = panelFor(t);
          if (panel) panel.hidden = !selected;
        });
        if (focus) tab.focus();
      };
      tabEls.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          activate(tab, false);
        });
        tab.addEventListener('keydown', function (e) {
          var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          activate(tabEls[(i + dir + tabEls.length) % tabEls.length], true);
        });
      });
      var current = list.querySelector('[aria-selected="true"]');
      activate(current || tabEls[0], false);
    });
  }

  function setValue(el, target, duration) {
    duration = duration == null ? 600 : duration;
    var max = parseFloat(el.style.getPropertyValue('--max') || el.dataset.max || 100);
    var from = parseFloat(el.style.getPropertyValue('--value')) || 0;
    var to = Math.max(0, Math.min(max, target));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || duration <= 0) {
      el.style.setProperty('--value', String(to));
      return;
    }
    var start = performance.now();
    var step = function (now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.style.setProperty('--value', (from + (to - from) * eased).toFixed(2));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function animateOnView(root) {
    root = root || document;
    var targets = root.querySelectorAll('[data-value][data-animate]');
    if (!targets.length) return;
    var reveal = function (el) {
      setValue(el, parseFloat(el.dataset.value));
    };
    if (!('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      return;
    }
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            reveal(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      {threshold: 0.4},
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  function clocks(root) {
    root = root || document;
    var els = root.querySelectorAll('[data-vui-clock]');
    if (!els.length) return;
    var pad = function (n) {
      return String(n).padStart(2, '0');
    };
    var tick = function () {
      var d = new Date();
      var t = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      els.forEach(function (el) {
        el.textContent = t;
      });
    };
    tick();
    clearInterval(window.__vuiClock);
    window.__vuiClock = setInterval(tick, 1000);
  }

  function drawers(root) {
    root = root || document;
    var targetEl = root.documentElement || root;
    if (targetEl.dataset.vuiDrawersReady) return;
    targetEl.dataset.vuiDrawersReady = '1';

    root.addEventListener('click', function (e) {
      // 1. Trigger Open
      var opener = e.target.closest('[data-open]');
      if (opener) {
        var targetId = opener.getAttribute('data-open');
        var target = document.getElementById(targetId);
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
      var closer = e.target.closest('[data-close]');
      if (closer) {
        var dlg = closer.closest('dialog');
        if (dlg) {
          e.preventDefault();
          dlg.close();
        } else {
          var drawer = closer.closest('.drawer');
          if (drawer) {
            e.preventDefault();
            drawer.classList.remove('active', 'open');
          }
        }
        return;
      }

      // 3. Dialog Backdrop click closes it
      if (e.target.matches('dialog.left, dialog.right')) {
        e.target.close();
        return;
      }

      // 4. Click outside non-dialog drawer closes it
      if (!e.target.closest('.drawer')) {
        var activeDrawers = document.querySelectorAll('.drawer.active, .drawer.open');
        for (var i = 0; i < activeDrawers.length; i++) {
          activeDrawers[i].classList.remove('active', 'open');
        }
      }

      // 5. Drawer/Dialog link click closes the drawer
      var link = e.target.closest('.drawer a, dialog.left nav a, dialog.right nav a');
      if (link) {
        var dlgElement = link.closest('dialog');
        if (dlgElement) {
          setTimeout(function () { dlgElement.close(); }, 80);
        } else {
          var drawerElement = link.closest('.drawer');
          if (drawerElement) {
            setTimeout(function () { drawerElement.classList.remove('active', 'open'); }, 80);
          }
        }
      }
    });
  }

  function init(root) {
    tabs(root);
    animateOnView(root);
    clocks(root);
    drawers(root);
  }

  window.vui = {init: init, tabs: tabs, setValue: setValue, drawers: drawers};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }
})();
