/* ============================================================
   optional behaviours, classic-script build.
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

  function menus(root) {
    root = root || document;
    var hasPopover = typeof HTMLElement.prototype.showPopover === 'function';

    if (hasPopover) {
      var scope = root === document ? document : root;
      scope.querySelectorAll('.vui details.dropdown').forEach(function (details) {
        var panel = details.querySelector(':scope > menu, :scope > nav, :scope > ul');
        var summary = details.querySelector(':scope > summary');
        if (!panel || !summary || panel.hasAttribute('popover')) return;

        panel.setAttribute('popover', 'auto');
        panel.classList.add('menu');

        var placePanel = function () {
          var r = summary.getBoundingClientRect();
          panel.style.top = (r.bottom + 6) + 'px';
          if (details.classList.contains('right')) {
            panel.style.left = '';
            panel.style.right = (window.innerWidth - r.right) + 'px';
          } else {
            panel.style.right = '';
            panel.style.left = r.left + 'px';
          }
        };

        summary.addEventListener('click', function (e) {
          e.preventDefault();
          if (panel.matches(':popover-open')) {
            panel.hidePopover();
          } else {
            panel.showPopover();
            placePanel();
          }
        });

        panel.addEventListener('toggle', function (e) {
          if (e.newState === 'open') details.setAttribute('open', '');
          else details.removeAttribute('open');
        });
      });
    }

    var targetEl = root.documentElement || root;
    if (targetEl.dataset.vuiMenusReady) return;
    targetEl.dataset.vuiMenusReady = '1';

    document.addEventListener(
      'toggle',
      function (e) {
        var d = e.target;
        if (d.matches && d.matches('details.dropdown') && d.open) {
          document.querySelectorAll('details.dropdown[open]').forEach(function (o) {
            if (o !== d) o.open = false;
          });
        }
      },
      true,
    );

    document.addEventListener('click', function (e) {
      if (!e.target.closest('details.dropdown')) {
        document.querySelectorAll('details.dropdown[open]').forEach(function (o) {
          o.open = false;
        });
        return;
      }
      var item = e.target.closest('details.dropdown a, details.dropdown button');
      if (item && !e.target.closest('summary')) {
        var d = item.closest('details.dropdown');
        if (d) setTimeout(function () { d.open = false; }, 80);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('details.dropdown[open]');
      if (!open) return;
      open.open = false;
      var summary = open.querySelector(':scope > summary');
      if (summary) summary.focus();
    });
  }

  function toolbars(root) {
    root = root || document;
    root.querySelectorAll('[role="toolbar"]').forEach(function (bar) {
      if (bar.dataset.vuiToolbarReady) return;
      bar.dataset.vuiToolbarReady = '1';

      var items = function () {
        return Array.prototype.slice
          .call(bar.querySelectorAll('button, a[href], select, [tabindex]'))
          .filter(function (el) {
            return !el.disabled && el.offsetParent !== null;
          });
      };
      var setStop = function (active) {
        items().forEach(function (el) {
          el.tabIndex = el === active ? 0 : -1;
        });
      };
      var list = items();
      if (list.length) setStop(list[0]);

      bar.addEventListener('keydown', function (e) {
        var vertical = bar.classList.contains('vertical');
        var fwd = vertical ? 'ArrowDown' : 'ArrowRight';
        var back = vertical ? 'ArrowUp' : 'ArrowLeft';
        var cur = items();
        var i = cur.indexOf(document.activeElement);
        if (i === -1) return;
        var n;
        if (e.key === fwd) n = (i + 1) % cur.length;
        else if (e.key === back) n = (i - 1 + cur.length) % cur.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = cur.length - 1;
        else return;
        e.preventDefault();
        setStop(cur[n]);
        cur[n].focus();
      });
      bar.addEventListener('focusin', function (e) {
        if (items().indexOf(e.target) !== -1) setStop(e.target);
      });
    });
  }

  function ensureToaster(placement) {
    var region = document.querySelector('.vui.toaster, .vui .toaster');
    if (!region) {
      region = document.createElement('div');
      region.className = 'vui toaster' + (placement ? ' ' + placement : '');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'false');
      document.body.appendChild(region);
    }
    return region;
  }

  function toast(message, options) {
    options = options || {};
    if (typeof options === 'string') options = {tone: options};
    var tone = options.tone || '';
    var title = options.title || '';
    var duration = options.duration == null ? 4000 : options.duration;
    var role = options.role || 'status';
    var dismissible = options.dismissible !== false;

    var region = ensureToaster(options.placement || '');
    var el = document.createElement('div');
    el.className = 'toast' + (tone ? ' ' + tone : '');
    el.setAttribute('role', role === 'alert' ? 'alert' : 'status');

    var body = document.createElement('div');
    if (title) {
      var strong = document.createElement('strong');
      strong.textContent = title;
      body.appendChild(strong);
    }
    body.appendChild(document.createTextNode(message == null ? '' : String(message)));
    el.appendChild(body);

    var timer;
    var dismiss = function () {
      if (el.dataset.leaving) return;
      el.dataset.leaving = '1';
      clearTimeout(timer);
      el.classList.add('is-leaving');
      var done = function () { el.remove(); };
      el.addEventListener('animationend', done, {once: true});
      setTimeout(done, 400);
    };

    if (dismissible) {
      var btn = document.createElement('button');
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

    return {el: el, dismiss: dismiss};
  }

  function init(root) {
    tabs(root);
    animateOnView(root);
    clocks(root);
    drawers(root);
    menus(root);
    toolbars(root);
  }

  window.vui = {
    init: init,
    tabs: tabs,
    setValue: setValue,
    drawers: drawers,
    menus: menus,
    toolbars: toolbars,
    toast: toast,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }
})();
