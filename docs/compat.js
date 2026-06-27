/* ============================================================
   VantaUI docs: compatibility table renderer.

   Reads the canonical catalog in compat-data.js and paints three
   searchable / filterable views into #compat-main:
     1. Components   — every trigger, its helper words (chips coloured by
                       kind), public knobs, and links to the live demo + docs.
     2. Combinations — which components nest/pair (a symmetric adjacency
                       built from each entry's `combines`) and their conflicts.
     3. Utilities    — which free-floating helper families apply to which
                       component groups.

   The page chrome (header, sidebar drawer, geometry switch) matches the
   gallery; this module only owns the compat content + the filter bar, and
   reuses js/vantaui.js for tooltips (helper-chip notes) and the drawer.
   ============================================================ */
import { COMPONENTS, UTILITIES, GROUPS, KINDS } from './compat-data.js';

(function () {
  'use strict';

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* The helper-chip tone is keyed off `kind`; styling lives in compat.css
     via [data-kind="…"]. Keeping the class list short keeps the markup terse. */
  function helperChip(h) {
    var note = h.note ? h.word + ' — ' + h.note : h.word + ' (' + h.kind + ')';
    var chip = el('span', 'compat-chip');
    chip.dataset.kind = h.kind;
    chip.dataset.tip = note;
    chip.textContent = h.word;
    return chip;
  }

  /* Build a symmetric adjacency from the per-entry `combines` lists so a
     pairing authored on one side shows on both. */
  function buildAdjacency() {
    var byId = {};
    COMPONENTS.forEach(function (c) {
      byId[c.id] = new Set(c.combines || []);
    });
    COMPONENTS.forEach(function (c) {
      (c.combines || []).forEach(function (other) {
        if (byId[other]) byId[other].add(c.id);
      });
    });
    return byId;
  }

  var NAME = {};
  COMPONENTS.forEach(function (c) {
    NAME[c.id] = c.name;
  });

  /* ---------- Section 1: component reference ---------- */
  function renderComponents() {
    var sec = el('section', 'vui-section vui-prose');
    sec.id = 'components';
    sec.appendChild(el('h2', null, 'Components'));
    sec.appendChild(
      el(
        'p',
        'blurb',
        'Every component, its trigger, and the helper words it accepts. ' +
          'Helper chips are toned by kind — hover one for what it does.',
      ),
    );

    GROUPS.forEach(function (group) {
      var members = COMPONENTS.filter(function (c) {
        return c.group === group;
      });
      if (!members.length) return;

      var groupWrap = el('div', 'compat-group bleed');
      groupWrap.dataset.group = group;
      groupWrap.appendChild(el('h3', 'compat-group__title', group));

      var grid = el('div', 'compat-cards');
      members.forEach(function (c) {
        grid.appendChild(componentCard(c));
      });
      groupWrap.appendChild(grid);
      sec.appendChild(groupWrap);
    });

    return sec;
  }

  function componentCard(c) {
    var card = el('article', 'compat-card');
    card.id = 'cmp-' + c.id;
    card.dataset.filterable = 'component';
    card.dataset.group = c.group;
    card.dataset.kinds = (c.helpers || [])
      .map(function (h) {
        return h.kind;
      })
      .join(' ');

    var head = el('header', 'compat-card__head');
    head.appendChild(el('h4', null, esc(c.name)));
    var links = el('span', 'compat-card__links');
    if (c.live) {
      links.innerHTML +=
        '<a href="index.html#' + c.live + '" title="See it live">live&nbsp;&#8599;</a>';
    }
    links.innerHTML +=
      '<a href="' +
      c.doc +
      '" title="Documentation">docs</a>';
    head.appendChild(links);
    card.appendChild(head);

    card.appendChild(el('code', 'compat-card__trigger', esc(c.trigger)));

    if (c.helpers && c.helpers.length) {
      var chips = el('div', 'compat-chips');
      c.helpers.forEach(function (h) {
        chips.appendChild(helperChip(h));
      });
      card.appendChild(chips);
    } else {
      card.appendChild(el('p', 'compat-card__none', 'No helper words — bare element.'));
    }

    if (c.knobs && c.knobs.length) {
      var knobs = el('dl', 'compat-knobs');
      c.knobs.forEach(function (k) {
        knobs.appendChild(el('dt', null, esc(k.name)));
        knobs.appendChild(el('dd', null, esc(k.note || '')));
      });
      card.appendChild(knobs);
    }

    /* searchable haystack: name, trigger, every helper word + note, knobs */
    var hay = [c.name, c.id, c.trigger];
    (c.helpers || []).forEach(function (h) {
      hay.push(h.word, h.note || '');
    });
    (c.knobs || []).forEach(function (k) {
      hay.push(k.name, k.note || '');
    });
    card.dataset.search = hay.join(' ').toLowerCase();

    return card;
  }

  /* ---------- Section 2: combinations + conflicts ---------- */
  function renderCombinations(adj) {
    var sec = el('section', 'vui-section vui-prose');
    sec.id = 'combinations';
    sec.appendChild(el('h2', null, 'Combinations'));
    sec.appendChild(
      el(
        'p',
        'blurb',
        'Which components nest or pair idiomatically, and the words that ' +
          'cannot share an element. Combine links jump to the component above.',
      ),
    );

    var table = el('div', 'compat-combo bleed');
    COMPONENTS.forEach(function (c) {
      var partners = Array.from(adj[c.id] || []).sort(function (a, b) {
        return NAME[a].localeCompare(NAME[b]);
      });
      if (!partners.length && !(c.conflicts || []).length) return;

      var row = el('div', 'compat-combo__row');
      row.dataset.filterable = 'component';
      row.dataset.group = c.group;
      row.dataset.kinds = '';

      var label = el('div', 'compat-combo__name');
      label.innerHTML = '<a href="#cmp-' + c.id + '">' + esc(c.name) + '</a>';
      row.appendChild(label);

      var cells = el('div', 'compat-combo__cells');

      var combo = el('div', 'compat-combo__cell');
      combo.appendChild(el('span', 'compat-combo__tag', 'combines'));
      if (partners.length) {
        partners.forEach(function (p) {
          var a = el('a', 'compat-chip compat-chip--link');
          a.href = '#cmp-' + p;
          a.textContent = NAME[p] || p;
          combo.appendChild(a);
        });
      } else {
        combo.appendChild(el('span', 'compat-card__none', '—'));
      }
      cells.appendChild(combo);

      var conf = el('div', 'compat-combo__cell');
      conf.appendChild(el('span', 'compat-combo__tag', 'conflicts'));
      if ((c.conflicts || []).length) {
        c.conflicts.forEach(function (x) {
          conf.appendChild(el('span', 'compat-chip compat-chip--conflict', esc(x)));
        });
      } else {
        conf.appendChild(el('span', 'compat-card__none', 'none'));
      }
      cells.appendChild(conf);

      row.appendChild(cells);

      var hay = [c.name, c.id];
      partners.forEach(function (p) {
        hay.push(NAME[p]);
      });
      (c.conflicts || []).forEach(function (x) {
        hay.push(x);
      });
      row.dataset.search = hay.join(' ').toLowerCase();

      table.appendChild(row);
    });

    sec.appendChild(table);
    return sec;
  }

  /* ---------- Section 3: utility applicability ---------- */
  function renderUtilities() {
    var sec = el('section', 'vui-section vui-prose');
    sec.id = 'utilities';
    sec.appendChild(el('h2', null, 'Utility applicability'));
    sec.appendChild(
      el(
        'p',
        'blurb',
        'Free-floating helper families and the component groups they ' +
          'sensibly target. (Tones, sizes and shapes are per-component above.)',
      ),
    );

    var table = el('div', 'compat-util bleed');
    UTILITIES.forEach(function (u) {
      var row = el('div', 'compat-util__row');
      row.dataset.filterable = 'utility';
      row.dataset.group = u.appliesTo.join(' ');

      row.appendChild(el('code', 'compat-util__label', esc(u.label)));

      var tags = el('div', 'compat-util__groups');
      GROUPS.forEach(function (g) {
        var on = u.appliesTo.indexOf(g) !== -1;
        var tag = el('span', 'compat-grouptag' + (on ? ' is-on' : ''));
        tag.textContent = g;
        tags.appendChild(tag);
      });
      row.appendChild(tags);

      row.appendChild(el('p', 'compat-util__note', esc(u.note)));

      row.dataset.search = (u.label + ' ' + u.note + ' ' + u.appliesTo.join(' ')).toLowerCase();
      table.appendChild(row);
    });

    sec.appendChild(table);
    return sec;
  }

  /* ---------- Filter toolbar ---------- */
  var state = { q: '', groups: new Set(), kinds: new Set() };

  function renderToolbar() {
    var bar = document.getElementById('compat-toolbar');
    if (!bar) return;

    var search = el('label', 'compat-search');
    search.innerHTML = '<i>search</i>';
    var input = el('input');
    input.type = 'search';
    input.placeholder = 'Search components, helpers, knobs…';
    input.setAttribute('aria-label', 'Search the compatibility table');
    input.addEventListener('input', function () {
      state.q = input.value.trim().toLowerCase();
      applyFilters();
    });
    search.appendChild(input);
    bar.appendChild(search);

    var groupChips = el('div', 'compat-filter');
    groupChips.appendChild(el('span', 'compat-filter__label', 'Group'));
    GROUPS.forEach(function (g) {
      groupChips.appendChild(toggleChip(g, state.groups, g));
    });
    bar.appendChild(groupChips);

    var kindChips = el('div', 'compat-filter');
    kindChips.appendChild(el('span', 'compat-filter__label', 'Kind'));
    Object.keys(KINDS).forEach(function (k) {
      var chip = toggleChip(k, state.kinds, k);
      chip.dataset.kind = k;
      chip.dataset.tip = KINDS[k];
      kindChips.appendChild(chip);
    });
    bar.appendChild(kindChips);

    var clear = el('button', 'ghost small compat-clear');
    clear.type = 'button';
    clear.innerHTML = '<i>backspace</i>Clear';
    clear.addEventListener('click', function () {
      state.q = '';
      state.groups.clear();
      state.kinds.clear();
      input.value = '';
      bar.querySelectorAll('.compat-toggle.is-on').forEach(function (c) {
        c.classList.remove('is-on');
        c.setAttribute('aria-pressed', 'false');
      });
      applyFilters();
    });
    bar.appendChild(clear);
  }

  function toggleChip(label, set, value) {
    var chip = el('button', 'compat-toggle');
    chip.type = 'button';
    chip.textContent = label;
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', function () {
      var on = set.has(value);
      if (on) set.delete(value);
      else set.add(value);
      chip.classList.toggle('is-on', !on);
      chip.setAttribute('aria-pressed', String(!on));
      applyFilters();
    });
    return chip;
  }

  /* ---------- Filtering ---------- */
  function matches(node) {
    var kind = node.dataset.filterable;
    if (state.q && node.dataset.search.indexOf(state.q) === -1) return false;

    if (state.groups.size) {
      if (kind === 'utility') {
        // utility rows carry a space-list of every group they apply to
        var groups = node.dataset.group.split(' ');
        var hit = groups.some(function (g) {
          return state.groups.has(g);
        });
        if (!hit) return false;
      } else if (!state.groups.has(node.dataset.group)) {
        return false;
      }
    }

    // kind filter only constrains component cards/rows (utilities have no kind)
    if (state.kinds.size && kind === 'component') {
      var nodeKinds = node.dataset.kinds ? node.dataset.kinds.split(' ') : [];
      var kindHit = nodeKinds.some(function (k) {
        return state.kinds.has(k);
      });
      if (!kindHit) return false;
    }
    return true;
  }

  function applyFilters() {
    var nodes = document.querySelectorAll('[data-filterable]');
    var visible = 0;
    nodes.forEach(function (n) {
      var show = matches(n);
      n.hidden = !show;
      if (show) visible++;
    });

    // collapse empty component sub-groups
    document.querySelectorAll('.compat-group').forEach(function (g) {
      var anyVisible = g.querySelector('[data-filterable]:not([hidden])');
      g.hidden = !anyVisible;
    });

    // hide a whole section + its nav link when it has nothing
    ['components', 'combinations', 'utilities'].forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      var anyVisible = section.querySelector('[data-filterable]:not([hidden])');
      section.hidden = !anyVisible;
      var link = document.querySelector('#doc-nav a[data-target="' + id + '"]');
      if (link) link.hidden = !anyVisible;
    });

    var empty = document.getElementById('compat-empty');
    if (empty) empty.hidden = visible > 0;
  }

  /* ---------- Sidebar nav (mirrors the gallery's) ---------- */
  function renderNav() {
    var nav = document.getElementById('doc-nav');
    if (!nav) return;
    nav.appendChild(el('h6', null, 'Compatibility'));
    [
      ['components', 'Components'],
      ['combinations', 'Combinations'],
      ['utilities', 'Utility applicability'],
    ].forEach(function (pair) {
      var a = el('a');
      a.href = '#' + pair[0];
      a.dataset.target = pair[0];
      a.textContent = pair[1];
      nav.appendChild(a);
    });
  }

  /* scrollspy: highlight the active section (same model as gallery.js) */
  function wireSpy() {
    var links = [].slice.call(document.querySelectorAll('#doc-nav a'));
    var map = {};
    links.forEach(function (l) {
      map[l.dataset.target] = l;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.remove('active');
          });
          var active = map[en.target.id];
          if (active) active.classList.add('active');
        });
      },
      { rootMargin: '-12% 0px -78% 0px', threshold: 0 },
    );
    document.querySelectorAll('.vui-section').forEach(function (s) {
      io.observe(s);
    });
  }

  /* geometry switch: flip the docs between corner-shape and clip-path
     (persisted). Identical behaviour to the gallery's toggle. */
  function wireGeometry() {
    var btn = document.getElementById('geo-toggle');
    if (!btn) return;
    var body = document.body;
    var label = btn.querySelector('span');
    var KEY = 'vui-geometry';
    function apply(clip) {
      body.classList.toggle('vui-clip', clip);
      btn.setAttribute('aria-pressed', String(clip));
      if (label) label.textContent = clip ? 'Clip' : 'Shape';
      btn.title = clip
        ? 'Corner geometry: clip-path (click to use the shape engine)'
        : 'Corner geometry: shape engine (click to force clip-path)';
    }
    var saved;
    try {
      saved = localStorage.getItem(KEY);
    } catch (e) {}
    apply(saved === 'clip');
    btn.addEventListener('click', function () {
      var clip = !body.classList.contains('vui-clip');
      apply(clip);
      try {
        localStorage.setItem(KEY, clip ? 'clip' : 'shape');
      } catch (e) {}
    });
  }

  /* Publish the sticky toolbar's height so anchored jumps land below it
     (CSS reads it via --compat-scroll-offset on scroll-margin). */
  function wireScrollOffset() {
    var bar = document.getElementById('compat-toolbar');
    if (!bar) return;
    function sync() {
      document.documentElement.style.setProperty(
        '--compat-scroll-offset',
        bar.offsetHeight + 'px',
      );
    }
    sync();
    window.addEventListener('resize', sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(bar);
  }

  function boot() {
    var main = document.getElementById('compat-main');
    if (!main) return;
    var adj = buildAdjacency();
    main.appendChild(renderComponents());
    main.appendChild(renderCombinations(adj));
    main.appendChild(renderUtilities());
    var empty = el('p', 'compat-empty', 'No matches. Clear the filters to see everything.');
    empty.id = 'compat-empty';
    empty.hidden = true;
    main.appendChild(empty);

    renderToolbar();
    renderNav();
    wireScrollOffset();
    wireSpy();
    wireGeometry();
    if (window.vui && window.vui.init) window.vui.init(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
