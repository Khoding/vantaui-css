/* GENERATED from js/vantaui.js by scripts/build.mjs — do not edit by hand.
   Classic-script build: plain <script src="vantaui.global.js"> (works over
   file:// too). Exposes window.vui and auto-inits. The CSS works without it. */
(() => {
  // js/vantaui.js
  var isBrowser = typeof document !== "undefined";
  function tabs(root = document) {
    root.querySelectorAll('[role="tablist"]').forEach((list) => {
      if (list.dataset.vuiTabsReady) return;
      list.dataset.vuiTabsReady = "1";
      const tabEls = [...list.querySelectorAll('[role="tab"]')];
      const panelFor = (tab) => {
        const id = tab.getAttribute("aria-controls") || tab.dataset.tab;
        return id ? document.getElementById(id) : null;
      };
      const activate = (tab, focus = true) => {
        tabEls.forEach((t) => {
          const selected = t === tab;
          t.setAttribute("aria-selected", String(selected));
          t.tabIndex = selected ? 0 : -1;
          const panel = panelFor(t);
          if (panel) panel.hidden = !selected;
        });
        if (focus) tab.focus();
      };
      tabEls.forEach((tab, i) => {
        tab.addEventListener("click", () => activate(tab, false));
        tab.addEventListener("keydown", (e) => {
          const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          activate(tabEls[(i + dir + tabEls.length) % tabEls.length]);
        });
      });
      if (!tabEls.some((t) => t.getAttribute("aria-selected") === "true")) {
        if (tabEls[0]) activate(tabEls[0], false);
      } else {
        activate(list.querySelector('[aria-selected="true"]'), false);
      }
    });
  }
  function setValue(el, target, duration = 600) {
    const max = parseFloat(el.style.getPropertyValue("--max") || el.dataset.max || 100);
    const from = parseFloat(el.style.getPropertyValue("--value")) || 0;
    const to = Math.max(0, Math.min(max, target));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || duration <= 0) {
      el.style.setProperty("--value", String(to));
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.style.setProperty("--value", (from + (to - from) * eased).toFixed(2));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function animateOnView(root = document) {
    const targets = root.querySelectorAll("[data-value][data-animate]");
    if (!targets.length) return;
    const reveal = (el) => setValue(el, parseFloat(el.dataset.value));
    if (!("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    targets.forEach((el) => io.observe(el));
  }
  function clocks(root = document) {
    const els = root.querySelectorAll("[data-vui-clock]");
    if (!els.length) return;
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const d = /* @__PURE__ */ new Date();
      const t = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      els.forEach((el) => el.textContent = t);
    };
    tick();
    clearInterval(window.__vuiClock);
    window.__vuiClock = setInterval(tick, 1e3);
  }
  function tooltips(root = document) {
    let tip = document.getElementById("vui-tooltip");
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "vui-tooltip";
      tip.setAttribute("role", "tooltip");
      document.body.appendChild(tip);
    }
    let untrack = null;
    const GAP = 8;
    const place = (el) => {
      const r = el.getBoundingClientRect();
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      const half = tw / 2;
      let cx = r.left + r.width / 2;
      cx = Math.max(GAP + half, Math.min(cx, window.innerWidth - GAP - half));
      const below = r.top - th - GAP < 0;
      tip.classList.toggle("is-below", below);
      tip.style.left = cx + "px";
      tip.style.top = (below ? r.bottom : r.top) + "px";
    };
    const show = (el) => {
      tip.textContent = el.dataset.tip;
      place(el);
      tip.classList.add("is-visible");
      if (untrack) untrack();
      untrack = trackAnchor(() => place(el), () => tip.classList.contains("is-visible"));
    };
    const hide = () => {
      tip.classList.remove("is-visible");
      if (untrack) {
        untrack();
        untrack = null;
      }
    };
    root.querySelectorAll("[data-tip]").forEach((el) => {
      if (el.classList.contains("vui-tip-js")) return;
      el.classList.add("vui-tip-js");
      el.addEventListener("mouseenter", () => show(el));
      el.addEventListener("mouseleave", hide);
      el.addEventListener("focusin", () => show(el));
      el.addEventListener("focusout", hide);
    });
  }
  function drawers(root = document) {
    const targetEl = root.documentElement || root;
    if (targetEl.dataset.vuiDrawersReady) return;
    targetEl.dataset.vuiDrawersReady = "1";
    root.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-open]");
      if (opener) {
        const targetId = opener.getAttribute("data-open");
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          if (typeof target.showModal === "function") {
            target.showModal();
          } else {
            target.classList.add("active", "open");
          }
        }
        return;
      }
      const closer = e.target.closest("[data-close]");
      if (closer) {
        const dlg = closer.closest("dialog");
        if (dlg) {
          e.preventDefault();
          dlg.close();
        } else {
          const drawer = closer.closest(".drawer");
          if (drawer) {
            e.preventDefault();
            drawer.classList.remove("active", "open");
          }
        }
        return;
      }
      if (e.target.tagName === "DIALOG" && e.target.open && !e.target.hasAttribute("data-no-dismiss")) {
        const r = e.target.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) {
          e.target.close();
          return;
        }
      }
      if (!e.target.closest(".drawer")) {
        document.querySelectorAll(".drawer.active, .drawer.open").forEach((drawer) => {
          drawer.classList.remove("active", "open");
        });
      }
      const link = e.target.closest(".drawer a, dialog.left nav a, dialog.right nav a");
      if (link) {
        const dlg = link.closest("dialog");
        if (dlg) {
          setTimeout(() => dlg.close(), 80);
        } else {
          const drawer = link.closest(".drawer");
          if (drawer) {
            setTimeout(() => drawer.classList.remove("active", "open"), 80);
          }
        }
      }
    });
  }
  function placePopover(panel, anchor, opts = {}) {
    const { align = "start", gap = 6, matchWidth = false } = opts;
    const r = anchor.getBoundingClientRect();
    panel.style.top = r.bottom + gap + "px";
    if (matchWidth) panel.style.minInlineSize = r.width + "px";
    if (align === "end") {
      panel.style.left = "";
      panel.style.right = window.innerWidth - r.right + "px";
    } else {
      panel.style.right = "";
      panel.style.left = r.left + "px";
    }
  }
  function trackAnchor(reposition, isOpen) {
    const onMove = () => {
      if (isOpen()) reposition();
      else stop();
    };
    function stop() {
      removeEventListener("scroll", onMove, true);
      removeEventListener("resize", onMove);
    }
    addEventListener("scroll", onMove, { capture: true, passive: true });
    addEventListener("resize", onMove);
    return stop;
  }
  function menus(root = document) {
    const hasPopover = typeof HTMLElement.prototype.showPopover === "function";
    if (hasPopover) {
      (root === document ? document : root).querySelectorAll(".vui details.dropdown").forEach((details) => {
        const panel = details.querySelector(":scope > menu, :scope > nav, :scope > ul");
        const summary = details.querySelector(":scope > summary");
        if (!panel || !summary || panel.hasAttribute("popover")) return;
        panel.setAttribute("popover", "auto");
        panel.classList.add("menu");
        const placePanel = () => placePopover(panel, summary, {
          align: details.classList.contains("right") ? "end" : "start"
        });
        let untrack = null;
        summary.addEventListener("click", (e) => {
          e.preventDefault();
          if (panel.matches(":popover-open")) {
            panel.hidePopover();
          } else {
            panel.showPopover();
            placePanel();
            untrack = trackAnchor(placePanel, () => panel.matches(":popover-open"));
          }
        });
        panel.addEventListener("toggle", (e) => {
          if (e.newState === "open") {
            details.setAttribute("open", "");
          } else {
            details.removeAttribute("open");
            if (untrack) {
              untrack();
              untrack = null;
            }
          }
        });
      });
    }
    const target = root.documentElement || root;
    if (target.dataset.vuiMenusReady) return;
    target.dataset.vuiMenusReady = "1";
    document.addEventListener(
      "toggle",
      (e) => {
        const d = e.target;
        if (d.matches && d.matches("details.dropdown") && d.open) {
          document.querySelectorAll("details.dropdown[open]").forEach((o) => {
            if (o !== d) o.open = false;
          });
        }
      },
      true
    );
    document.addEventListener("click", (e) => {
      if (!e.target.closest("details.dropdown")) {
        document.querySelectorAll("details.dropdown[open]").forEach((o) => o.open = false);
        return;
      }
      const item = e.target.closest("details.dropdown a, details.dropdown button");
      if (item && !e.target.closest("summary")) {
        const d = item.closest("details.dropdown");
        if (d) setTimeout(() => d.open = false, 80);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const open = document.querySelector("details.dropdown[open]");
      if (!open) return;
      open.open = false;
      const summary = open.querySelector(":scope > summary");
      if (summary) summary.focus();
    });
  }
  function toolbars(root = document) {
    root.querySelectorAll('[role="toolbar"]').forEach((bar) => {
      if (bar.dataset.vuiToolbarReady) return;
      bar.dataset.vuiToolbarReady = "1";
      const items = () => [...bar.querySelectorAll("button, a[href], select, [tabindex]")].filter(
        (el) => !el.disabled && el.offsetParent !== null
      );
      const setStop = (active) => items().forEach((el) => el.tabIndex = el === active ? 0 : -1);
      const list = items();
      if (list.length) setStop(list[0]);
      bar.addEventListener("keydown", (e) => {
        const vertical = bar.classList.contains("vertical");
        const fwd = vertical ? "ArrowDown" : "ArrowRight";
        const back = vertical ? "ArrowUp" : "ArrowLeft";
        const cur = items();
        const i = cur.indexOf(document.activeElement);
        if (i === -1) return;
        let n;
        if (e.key === fwd) n = (i + 1) % cur.length;
        else if (e.key === back) n = (i - 1 + cur.length) % cur.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = cur.length - 1;
        else return;
        e.preventDefault();
        setStop(cur[n]);
        cur[n].focus();
      });
      bar.addEventListener("focusin", (e) => {
        if (items().includes(e.target)) setStop(e.target);
      });
    });
  }
  function ensureToaster(placement) {
    let region = document.querySelector(".vui.toaster, .vui .toaster");
    if (!region) {
      region = document.createElement("div");
      region.className = "vui toaster" + (placement ? " " + placement : "");
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "false");
      document.body.appendChild(region);
    }
    return region;
  }
  function toast(message, options = {}) {
    if (!isBrowser) return null;
    if (typeof options === "string") options = { tone: options };
    const {
      tone = "",
      title = "",
      duration = 4e3,
      role = "status",
      dismissible = true,
      placement = ""
    } = options;
    const region = ensureToaster(placement);
    const el = document.createElement("div");
    el.className = "toast" + (tone ? " " + tone : "");
    el.setAttribute("role", role === "alert" ? "alert" : "status");
    const body = document.createElement("div");
    if (title) {
      const strong = document.createElement("strong");
      strong.textContent = title;
      body.appendChild(strong);
    }
    body.appendChild(document.createTextNode(message == null ? "" : String(message)));
    el.appendChild(body);
    let timer;
    const dismiss = () => {
      if (el.dataset.leaving) return;
      el.dataset.leaving = "1";
      clearTimeout(timer);
      el.classList.add("is-leaving");
      const done = () => el.remove();
      el.addEventListener("animationend", done, { once: true });
      setTimeout(done, 400);
    };
    if (dismissible) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "icon small";
      btn.setAttribute("aria-label", "Dismiss");
      btn.setAttribute("data-close", "");
      btn.innerHTML = "<i>close</i>";
      btn.addEventListener("click", dismiss);
      el.appendChild(btn);
    }
    region.appendChild(el);
    if (duration > 0) timer = setTimeout(dismiss, duration);
    return { el, dismiss };
  }
  function carousels(root = document) {
    if (window.CSS && CSS.supports("scroll-marker-group: after")) return;
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const scope = root === document ? document : root;
    const icon = (glyph) => {
      const i = document.createElement("i");
      i.textContent = glyph;
      return i;
    };
    const button = (cls, label, glyph) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = cls;
      b.setAttribute("aria-label", label);
      b.appendChild(icon(glyph));
      return b;
    };
    scope.querySelectorAll(".vui .carousel, .vui.carousel").forEach((track) => {
      if (track.dataset.vuiCarouselReady) return;
      track.dataset.vuiCarouselReady = "1";
      const slides = [...track.children];
      if (!slides.length) return;
      const shell = document.createElement("div");
      shell.className = "vui-carousel-shell";
      track.parentNode.insertBefore(shell, track);
      shell.appendChild(track);
      const current = () => {
        const base = track.getBoundingClientRect().left;
        let best = 0;
        let min = Infinity;
        slides.forEach((s, i) => {
          const d = Math.abs(s.getBoundingClientRect().left - base);
          if (d < min) {
            min = d;
            best = i;
          }
        });
        return best;
      };
      const goto = (i) => {
        const slide = slides[Math.max(0, Math.min(slides.length - 1, i))];
        const delta = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
        track.scrollBy({ left: delta, behavior });
      };
      let prev = null;
      let next = null;
      if (!track.classList.contains("no-arrows")) {
        prev = button("vui-carousel-prev", "Previous", "chevron_left");
        next = button("vui-carousel-next", "Next", "chevron_right");
        prev.addEventListener("click", () => goto(current() - 1));
        next.addEventListener("click", () => goto(current() + 1));
        shell.append(prev, next);
      }
      let dots = [];
      if (!track.classList.contains("no-dots")) {
        const group = document.createElement("div");
        group.className = "vui-carousel-dots";
        group.setAttribute("aria-label", "Choose slide");
        dots = slides.map((s, i) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "vui-carousel-dot";
          dot.setAttribute("aria-label", `Slide ${i + 1}`);
          dot.addEventListener("click", () => goto(i));
          group.appendChild(dot);
          return dot;
        });
        shell.appendChild(group);
      }
      const sync = () => {
        const i = current();
        dots.forEach((dot, j) => {
          const on = j === i;
          dot.classList.toggle("is-current", on);
          if (on) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === slides.length - 1;
      };
      let raf = 0;
      track.addEventListener(
        "scroll",
        () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(sync);
        },
        { passive: true }
      );
      addEventListener("resize", sync);
      sync();
    });
  }
  function init(root = document) {
    if (!isBrowser) return;
    tabs(root);
    animateOnView(root);
    clocks(root);
    drawers(root);
    tooltips(root);
    menus(root);
    toolbars(root);
    carousels(root);
  }
  var VantaUI = { init, tabs, setValue, drawers, tooltips, menus, placePopover, trackAnchor, toolbars, carousels, toast };
  var vantaui_default = VantaUI;
  if (isBrowser) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => init());
    } else {
      init();
    }
    window.vui = VantaUI;
  }
})();
