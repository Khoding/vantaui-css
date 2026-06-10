/* ============================================================
   VantaUI docs — gallery data + renderer.

   Two kinds of section content:
     • static examples — a live demo + a "view code" button. The demo can
       carry presentational scaffolding (a sized frame box) while the COPYABLE
       source stays clean: author `code` (clean, shown + copied) and an
       optional `demo` (the scaffolded preview). When `demo` is omitted the
       demo IS the clean code.
     • playgrounds   — a live element you reconfigure with checkboxes/selects.
       A `render(state)` returns ONLY the component markup, so the preview, the
       copyable source, and the controls can never drift, and the code is clean
       by construction (no demo-only sizing leaks in).

   Foundations / utilities use a `render()` reference gallery (swatches/chips),
   not a code panel. Sections are grouped for the sidebar nav.
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     TOKEN + REFERENCE DATA (foundation & utility galleries)
     ============================================================ */
  const INK = ['ink-1000', 'ink-900', 'ink-800', 'ink-700', 'ink-600', 'ink-500', 'ink-400'];
  const CYAN = ['cyan-50', 'cyan-200', 'cyan-400', 'cyan-500', 'cyan-600', 'cyan-700'];
  const AMBER = ['amber-300', 'amber-400', 'amber-500', 'amber-600'];
  const RED = ['red-400', 'red-500', 'red-600'];
  const GREEN = ['green-400', 'green-500', 'green-600'];
  const SLATE = ['slate-50', 'slate-200', 'slate-300', 'slate-400', 'slate-500', 'slate-600'];
  const SPACE = [
    ['1', '2px'], ['2', '4px'], ['3', '8px'], ['4', '12px'], ['5', '16px'],
    ['6', '20px'], ['7', '24px'], ['8', '32px'], ['9', '40px'], ['10', '48px'], ['11', '64px'],
  ];

  function swatches(list, prefix) {
    return (
      '<div class="doc-swatches">' +
      list
        .map(function (name) {
          var dark = /(-50|-200|-300|-400|cyan-5|green-4|amber-3)/.test(name);
          return (
            '<div class="doc-swatch" style="background:var(--' + name + ')">' +
            '<span class="doc-swatch__name" style="color:' +
            (dark ? 'var(--ink-900)' : 'var(--slate-50)') + '">' +
            (prefix || '') + name + '</span></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  /* ---- reference helpers (utilities + primitives) ---- */
  function refChips(list) {
    return (
      '<div class="doc-ref-grid">' +
      list
        .map(function (it) {
          var name = Array.isArray(it) ? it[0] : it;
          var note = Array.isArray(it) ? it[1] : '';
          return (
            '<div class="doc-ref-item"><code>' + name + '</code>' +
            (note ? '<small>' + note + '</small>' : '') + '</div>'
          );
        })
        .join('') +
      '</div>'
    );
  }
  /* a grid of live tiles, each demonstrating one class in place */
  function refTiles(list) {
    return (
      '<div class="doc-ref-grid">' +
      list
        .map(function (it) {
          return (
            '<div class="doc-ref-item">' + it.sample + '<code>' + it.name + '</code></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  /* ============================================================
     SECTIONS
     ============================================================ */
  const SECTIONS = [
    /* ---------------- GETTING STARTED ---------------- */
    {
      group: 'Getting started',
      id: 'philosophy',
      title: 'Philosophy',
      blurb:
        'Three ingredients — <strong>Settings, Elements, Helpers</strong>. Add <code>class="vui"</code> to a root element and bare, semantic HTML (<code>header</code>, <code>nav</code>, <code>article</code>, <code>button</code>, <code>input</code>, <code>table</code>, <code>meter</code>, <code>dialog</code>…) comes alive with zero classes. Deviate from a default with one short <em>helper</em> word (<code>glow</code>, <code>danger</code>, <code>small</code>, <code>left</code>). Icons are <code>&lt;i&gt;home&lt;/i&gt;</code>. Everything ships inside <code>@layer</code>s at zero specificity, so your own styles always win.<br><br>Every component below is <strong>live</strong>: flip the checkboxes and selects to reconfigure it, then hit <strong>View code</strong> for the exact, copy-ready markup of that variant — nothing more.',
    },
    {
      group: 'Getting started',
      id: 'install',
      title: 'Install',
      blurb:
        'One stylesheet, one icon font. The optional JS adds tabs, drawers, the live clock, and meter/gauge animation — the CSS is fully usable without it.',
      examples: [
        {
          code: '<!doctype html>\n<html lang="en">\n  <head>\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link rel="stylesheet" href="dist/vantaui.min.css">\n  </head>\n  <body class="vui">\n    <h1>Command Center</h1>\n    <button type="submit">Authorize</button>\n\n    <!-- optional behaviours -->\n    <script type="module" src="js/vantaui.js"><\/script>\n  </body>\n</html>',
          noDemo: true,
        },
      ],
    },

    /* ---------------- FOUNDATIONS ---------------- */
    {
      group: 'Foundations',
      id: 'color',
      title: 'Color',
      blurb:
        'A cold near-black palette lit by one signal: detective cyan. Amber = hostile / caution, red = threat, green = secure / online. Color is scarce and always means something. Tokens ship as sRGB hex with an OKLCH upgrade.',
      render: function () {
        return (
          '<p class="doc-tok-h">Ink &amp; surfaces</p>' + swatches(INK, '--') +
          '<p class="doc-tok-h">Detective cyan — the signal</p>' + swatches(CYAN, '--') +
          '<p class="doc-tok-h">Amber · Red · Green — status</p>' +
          swatches(AMBER, '--') + swatches(RED, '--') + swatches(GREEN, '--') +
          '<p class="doc-tok-h">Cool neutrals / text</p>' + swatches(SLATE, '--')
        );
      },
    },
    {
      group: 'Foundations',
      id: 'type',
      title: 'Type',
      blurb:
        'Three voices: Chakra Petch (display / UI, uppercase + tracked), Rajdhani (HUD numerics), Share Tech Mono (telemetry). Sizes are fluid via clamp(). Webfonts swap with zero layout shift thanks to metric-matched fallbacks.',
      examples: [
        {
          code: '<h1>Knightfall Protocol</h1>\n<h2>Detective Mode</h2>\n<h3>Gadget Loadout</h3>\n<p>Body copy in the UI voice — terse, operational, system-to-operator.</p>',
        },
        {
          code: '<p class="vui-display">DISPLAY</p>\n<p class="vui-title">TITLE ROLE</p>\n<p class="vui-heading">HEADING ROLE</p>\n<span class="vui-readout">87.4</span>\n<p class="vui-eyebrow">System eyebrow</p>\n<p class="vui-signal">CRITICAL DATA 042.7</p>',
        },
        {
          code: '<p class="vui-mono">› crypto handshake 0x4F2A…9C1B … OK</p>\n<p>Inline <code>code</code>, a <kbd>Ctrl</kbd> key, and <mark>highlighted</mark> text.</p>',
        },
      ],
    },
    {
      group: 'Foundations',
      id: 'geometry',
      title: 'Spacing & geometry',
      blurb:
        '8px grid. Corners are cut, not rounded — the chamfer (cut TL+BR) and the four-corner notch are the signature silhouette. 2px is the most rounding you should ever see.',
      render: function () {
        return (
          '<div class="doc-spaces">' +
          SPACE.map(function (s) {
            return (
              '<div class="doc-space"><span class="doc-space__bar" style="inline-size:' + s[1] + '"></span>' +
              '<span class="doc-space__tag">--space-' + s[0] + ' · ' + s[1] + '</span></div>'
            );
          }).join('') +
          '</div>' +
          '<div class="doc-geo">' +
          '<div class="doc-geo__plate vui-chamfer">CHAMFER</div>' +
          '<div class="doc-geo__plate vui-notch">NOTCH</div>' +
          '<div class="doc-geo__plate" style="border-radius:var(--radius-sm)">2px MAX</div>' +
          '</div>'
        );
      },
    },
    {
      group: 'Foundations',
      id: 'icons',
      title: 'Icons',
      blurb:
        'Inside <code>.vui</code>, a bare <code>&lt;i&gt;</code> is an icon: write <code>&lt;i&gt;home&lt;/i&gt;</code> and the Material Symbols ligature draws the glyph. Use <code>&lt;em&gt;</code> for italic text. Add <code>fill</code> for the filled weight. Components space a leading <code>&lt;i&gt;</code> automatically.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <i>radar</i>\n  <i>shield</i>\n  <i>map</i>\n  <i>bolt</i>\n  <i class="fill">favorite</i>\n  <i>lock</i>\n</div>',
          demo: '<div class="vui-cluster" style="font-size:1.6rem">\n  <i>radar</i>\n  <i>shield</i>\n  <i>map</i>\n  <i>bolt</i>\n  <i class="fill">favorite</i>\n  <i>lock</i>\n</div>',
        },
      ],
    },
    {
      group: 'Foundations',
      id: 'effects',
      title: 'Glows & effects',
      blurb:
        'Light is emitted, not cast. Depth comes from inner darkening plus a colored outer glow. Surfaces carry faint hex-grid + scanline texture. The status <code>vui-dot</code> pulses; tone it with a modifier.',
      examples: [
        {
          code: '<div class="vui-row">\n  <span class="vui-dot"></span>\n  <span class="vui-dot vui-dot--warn"></span>\n  <span class="vui-dot vui-dot--threat"></span>\n  <span class="vui-dot vui-dot--cyan"></span>\n  <span class="vui-dot vui-dot--idle"></span>\n</div>',
        },
        {
          code: '<div class="vui-cluster">\n  <span class="badge cyan vui-glow-cyan">glow-cyan</span>\n  <span class="badge amber vui-glow-amber">glow-amber</span>\n  <span class="badge red vui-glow-red">glow-red</span>\n</div>',
        },
      ],
    },
    {
      group: 'Foundations',
      id: 'primitives',
      title: 'Primitives',
      blurb:
        'The HUD building blocks every component is assembled from — useful on their own. Apply the class to any element. Type roles (<code>vui-display/title/heading/readout/mono</code>) live under <a href="#type">Type</a>; below are the plates, frames, rules and textured backdrops.',
      render: function () {
        return (
          '<p class="doc-tok-h">Plates &amp; frames</p>' +
          '<div class="doc-ref-grid">' +
          '<div class="doc-ref-sample"><div class="vui-chamfer" style="block-size:60px;border:1px solid var(--hairline-strong);background:var(--surface-panel)"></div><code>vui-chamfer</code></div>' +
          '<div class="doc-ref-sample"><div class="vui-notch" style="block-size:60px;border:1px solid var(--hairline-strong);background:var(--surface-panel)"></div><code>vui-notch</code></div>' +
          '<div class="doc-ref-sample"><div class="vui-brackets" style="block-size:60px;display:grid;place-items:center;color:var(--text-muted)">framed</div><code>vui-brackets</code></div>' +
          '</div>' +
          '<p class="doc-tok-h">Eyebrow · signal · rule</p>' +
          '<div class="doc-ref-grid">' +
          '<div class="doc-ref-sample"><p class="vui-eyebrow" style="margin:0">System eyebrow</p><code>vui-eyebrow</code></div>' +
          '<div class="doc-ref-sample"><p class="vui-signal" style="margin:0">SIGNAL 042.7</p><code>vui-signal</code></div>' +
          '<div class="doc-ref-sample"><hr class="vui-rule" style="inline-size:100%"><code>vui-rule</code></div>' +
          '</div>' +
          '<p class="doc-tok-h">Textured backdrops</p>' +
          '<div class="doc-ref-grid">' +
          '<div class="doc-ref-sample"><div class="vui-bg-grid" style="block-size:64px;border:1px solid var(--hairline)"></div><code>vui-bg-grid</code></div>' +
          '<div class="doc-ref-sample"><div class="vui-bg-scan" style="block-size:64px;border:1px solid var(--hairline)"></div><code>vui-bg-scan</code></div>' +
          '<div class="doc-ref-sample"><div class="vui-bg-hud" style="block-size:64px;border:1px solid var(--hairline)"></div><code>vui-bg-hud</code></div>' +
          '</div>'
        );
      },
    },

    /* ---------------- UTILITIES (full reference) ---------------- */
    {
      group: 'Utilities',
      id: 'utilities',
      title: 'Utility classes',
      blurb:
        'A focused, BeerCSS-sized helper set — not a Tailwind-scale explosion. All <code>vui-</code> prefixed, logical-property based, and living in the <code>utilities</code> layer so they win on ties but never on your own styles. Spacing follows the 8px scale (index → <code>--space-N</code>).',
      render: function () {
        var size = function (n) {
          return { name: n, sample: '<span class="' + n + '" style="line-height:1">Aa</span>' };
        };
        var color = function (n) {
          return { name: n, sample: '<span class="' + n + '" style="font-weight:600">Aa 042</span>' };
        };
        var glow = function (n) {
          return {
            name: n,
            sample: '<span class="' + n + '" style="display:inline-block;inline-size:26px;block-size:26px;background:var(--surface-panel);border:1px solid var(--hairline-strong)"></span>',
          };
        };
        var surf = function (n) {
          return {
            name: n,
            sample: '<span class="' + n + '" style="display:inline-block;inline-size:26px;block-size:26px;border:1px solid var(--hairline-strong)"></span>',
          };
        };
        return (
          '<p class="doc-tok-h">Display</p>' +
          refChips(['vui-flex', 'vui-inline-flex', 'vui-grid-d', 'vui-block', 'vui-inline-block', 'vui-inline', 'vui-contents', 'vui-hidden', 'vui-sr-only']) +
          '<p class="doc-tok-h">Flex &amp; alignment</p>' +
          refChips(['vui-flex-row', 'vui-flex-col', 'vui-wrap', 'vui-nowrap', 'vui-flex-1', 'vui-grow', 'vui-shrink-0', 'vui-items-start', 'vui-items-center', 'vui-items-end', 'vui-items-stretch', 'vui-items-baseline', 'vui-justify-start', 'vui-justify-center', 'vui-justify-end', 'vui-justify-between', 'vui-justify-around']) +
          '<p class="doc-tok-h">Layout helpers</p>' +
          refChips([['vui-row', 'flex row, centered'], ['vui-row--wrap', 'wrapping row'], ['vui-col', 'flex column'], ['vui-stack', 'vertical rhythm'], ['vui-cluster', 'wrapping cluster'], ['vui-center', 'grid place-items'], ['vui-between', 'space-between'], ['vui-spacer', 'flex spacer'], ['vui-container', 'max-width + gutter'], ['vui-container--narrow', 'tighter measure'], ['vui-container--fluid', 'edge-to-edge']]) +
          '<p class="doc-tok-h">Gap · 8px scale</p>' +
          refChips([['vui-gap-0', '0'], ['vui-gap-1', '2px'], ['vui-gap-2', '4px'], ['vui-gap-3', '8px'], ['vui-gap-4', '12px'], ['vui-gap-5', '16px'], ['vui-gap-6', '20px'], ['vui-gap-7', '24px'], ['vui-gap-8', '32px']]) +
          '<p class="doc-tok-h">Padding · <code>vui-p / vui-pi / vui-pb</code></p>' +
          refChips(['vui-p-0…8', 'vui-pi-0…8', 'vui-pb-0…8']) +
          '<p class="doc-tok-h">Margin · <code>vui-m / vui-mi / vui-mb / vui-mbe</code></p>' +
          refChips(['vui-m-0…6', 'vui-m-auto', 'vui-mi-auto', 'vui-mb-0…8', 'vui-mbe-3…6']) +
          '<p class="doc-tok-h">Font size · clamp() fluid</p>' +
          refTiles(['vui-text-2xs', 'vui-text-xs', 'vui-text-sm', 'vui-text-base', 'vui-text-md', 'vui-text-lg', 'vui-text-xl', 'vui-text-2xl', 'vui-text-3xl', 'vui-text-4xl', 'vui-text-5xl'].map(size)) +
          '<p class="doc-tok-h">Text colour</p>' +
          refTiles(['vui-text-primary', 'vui-text-secondary', 'vui-text-muted', 'vui-text-faint', 'vui-text-cyan', 'vui-text-amber', 'vui-text-red', 'vui-text-green'].map(color)) +
          '<p class="doc-tok-h">Font · weight · tracking · align</p>' +
          refChips(['vui-font-display', 'vui-font-ui', 'vui-font-hud', 'vui-font-mono', 'vui-fw-light', 'vui-fw-regular', 'vui-fw-medium', 'vui-fw-semibold', 'vui-fw-bold', 'vui-tracked', 'vui-tracked-wider', 'vui-tracked-widest', 'vui-upper', 'vui-text-start', 'vui-text-center', 'vui-text-end', 'vui-truncate', 'vui-nowrap-text']) +
          '<p class="doc-tok-h">Surfaces</p>' +
          refTiles(['vui-bg-void', 'vui-bg-base', 'vui-bg-raised', 'vui-bg-panel', 'vui-bg-inset'].map(surf)) +
          '<p class="doc-tok-h">Borders</p>' +
          refChips(['vui-border', 'vui-border-strong', 'vui-border-accent', 'vui-border-0']) +
          '<p class="doc-tok-h">Glows</p>' +
          refTiles(['vui-glow-cyan', 'vui-glow-amber', 'vui-glow-red', 'vui-glow-green'].map(glow)) +
          '<p class="doc-tok-h">Position · sizing · misc</p>' +
          refChips(['vui-relative', 'vui-absolute', 'vui-sticky', 'vui-w-full', 'vui-h-full', 'vui-w-auto', 'vui-min-w-0', 'vui-overflow-auto', 'vui-overflow-hidden', 'vui-pointer', 'vui-select-none', 'vui-text-glow', 'vui-flicker', 'vui-scanning']) +
          '<p class="doc-tok-h">Responsive show / hide</p>' +
          refChips([['vui-until-s', 'hide ≥ 36rem'], ['vui-from-s', 'hide &lt; 36rem'], ['vui-until-m', 'hide ≥ 48rem'], ['vui-from-m', 'hide &lt; 48rem'], ['vui-until-l', 'hide ≥ 64rem'], ['vui-from-l', 'hide &lt; 64rem'], ['vui-until-xl', 'hide ≥ 80rem'], ['vui-from-xl', 'hide &lt; 80rem']])
        );
      },
    },

    /* ---------------- CHROME ---------------- */
    {
      group: 'Chrome',
      id: 'header',
      title: 'Header / app bar',
      blurb:
        'A <code>&lt;header&gt;</code> containing a <code>&lt;nav&gt;</code> becomes an app bar — no class required. The first <code>&lt;a&gt;</code> is the brand; the first <code>&lt;nav&gt;</code> pushes trailing actions right; a <code>&lt;form role="search"&gt;</code> is the search shell; a <code>&lt;menu&gt;</code> is the trailing cluster. A container query collapses the nav to a burger when the bar itself is narrow.',
      play: {
        state: { tone: '', shape: '', align: '', size: '', sticky: false, search: false },
        controls: [
          { type: 'select', key: 'tone', label: 'Surface', options: [{ label: 'Default', value: '' }, { label: 'Glow', value: 'glow' }, { label: 'Bare', value: 'bare' }] },
          { type: 'select', key: 'shape', label: 'Shape', options: [{ label: 'Attached', value: '' }, { label: 'Float', value: 'float' }] },
          { type: 'select', key: 'align', label: 'Nav', options: [{ label: 'Leading', value: '' }, { label: 'Centered', value: 'center' }] },
          { type: 'select', key: 'size', label: 'Height', options: [{ label: 'Default', value: '' }, { label: 'Tall', value: 'tall' }] },
          { type: 'toggle', key: 'search', label: 'Search field' },
          { type: 'toggle', key: 'sticky', label: 'Sticky' },
        ],
        render: function (s) {
          var c = [s.tone, s.shape, s.align, s.size, s.sticky && 'sticky'].filter(Boolean);
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          var search = s.search
            ? '\n  <form role="search">\n    <i>search</i>\n    <input type="search" placeholder="Search sectors…">\n  </form>'
            : '';
          return (
            '<header' + cls + '>\n' +
            '  <a>VANTA<b>UI</b></a>\n' +
            '  <nav>\n    <a aria-current="page">Command</a>\n    <a>Intel</a>\n    <a>Comms</a>\n  </nav>' +
            search + '\n' +
            '  <menu>\n    <span class="badge green dot">Online</span>\n    <button aria-label="Account"><i>account_circle</i></button>\n  </menu>\n' +
            '</header>'
          );
        },
      },
    },
    {
      group: 'Chrome',
      id: 'footer',
      title: 'Footer',
      blurb:
        'A bare <code>&lt;footer&gt;</code> (outside an <code>&lt;article&gt;</code>/<code>&lt;dialog&gt;</code>) is the page footer. Pick a shape: the default hairline strip, <code>status</code> (a dense telemetry bar where each child is a cell — add <code>signal</code> for the accent tone), or <code>columns</code> (an auto-fit sitemap; a <code>.bottom</code> child spans full width).',
      play: {
        state: { shape: '', glow: false, base: false },
        controls: [
          { type: 'select', key: 'shape', label: 'Shape', options: [{ label: 'Strip', value: '' }, { label: 'Status bar', value: 'status' }, { label: 'Columns', value: 'columns' }] },
          { type: 'toggle', key: 'glow', label: 'Glow edge' },
          { type: 'toggle', key: 'base', label: 'Base surface' },
        ],
        render: function (s) {
          var mods = [s.shape, s.glow && 'glow', s.base && 'base'].filter(Boolean);
          var cls = mods.length ? ' class="' + mods.join(' ') + '"' : '';
          if (s.shape === 'status') {
            return (
              '<footer' + cls + '>\n' +
              '  <span><small>UPLINK</small>04:18:22</span>\n' +
              '  <span class="signal"><small>THREAT</small>HIGH</span>\n' +
              '  <span><small>SECTOR</small>14-C</span>\n' +
              '  <span><small>STATUS</small><span class="badge green dot">Online</span></span>\n' +
              '  <span class="max"></span>\n' +
              '  <span><small>BUILD</small>1.0.1</span>\n' +
              '</footer>'
            );
          }
          if (s.shape === 'columns') {
            return (
              '<footer' + cls + '>\n' +
              '  <section>\n    <h6>Framework</h6>\n    <nav><a>Install</a><a>Vue</a><a>Nuxt</a></nav>\n  </section>\n' +
              '  <section>\n    <h6>Components</h6>\n    <nav><a>Buttons</a><a>Panels</a><a>Forms</a></nav>\n  </section>\n' +
              '  <section>\n    <h6>Resources</h6>\n    <nav><a>GitHub</a><a>Changelog</a><a>License</a></nav>\n  </section>\n' +
              '  <div class="bottom"><small>© 2025 VantaUI · MIT</small></div>\n' +
              '</footer>'
            );
          }
          return (
            '<footer' + cls + '>\n' +
            '  <a><b>VANTA</b>UI</a>\n' +
            '  <nav>\n    <a>Docs</a>\n    <a>GitHub</a>\n    <a>Changelog</a>\n  </nav>\n' +
            '  <span class="max"></span>\n' +
            '  <small>© 2025 · MIT License</small>\n' +
            '</footer>'
          );
        },
      },
    },
    {
      group: 'Chrome',
      id: 'navigation',
      title: 'Navigation',
      blurb:
        'Patterns from bare semantics. The <strong>bottom tab bar</strong> below is <code>&lt;nav class="bottom"&gt;</code> — items are <code>&lt;a&gt;</code>/<code>&lt;button&gt;</code> with an <code>&lt;i&gt;</code> + label; mark the current one <code>active</code>. Add <code>fixed</code> to pin it to the viewport floor. A <strong>breadcrumb</strong> is any <code>&lt;nav&gt;</code> wrapping an <code>&lt;ol&gt;</code> — detected with <code>:has()</code>, no class, auto separators.',
      play: {
        state: { active: 0 },
        controls: [
          { type: 'select', key: 'active', label: 'Active', options: [{ label: 'Ops', value: 0 }, { label: 'Files', value: 1 }, { label: 'Map', value: 2 }, { label: 'Setup', value: 3 }] },
        ],
        render: function (s) {
          var items = [['space_dashboard', 'Ops'], ['folder', 'Files'], ['map', 'Map'], ['settings', 'Setup']];
          var active = Number(s.active);
          return (
            '<nav class="bottom">\n' +
            items
              .map(function (it, i) {
                return '  <a' + (i === active ? ' class="active"' : '') + '><i>' + it[0] + '</i>' + it[1] + '</a>';
              })
              .join('\n') +
            '\n</nav>'
          );
        },
      },
      examples: [
        {
          label: 'Breadcrumb — <nav><ol>…</ol></nav>',
          code: '<nav aria-label="Breadcrumb">\n  <ol>\n    <li><a href="/">Home</a></li>\n    <li><a href="/cases">Cases</a></li>\n    <li><a href="/cases/active">Active</a></li>\n    <li aria-current="page">Bleake Island</li>\n  </ol>\n</nav>',
        },
      ],
    },
    {
      group: 'Chrome',
      id: 'drawer',
      title: 'Off-canvas drawer',
      blurb:
        '<code>&lt;dialog class="left"&gt;</code> / <code>&lt;dialog class="right"&gt;</code> is an edge drawer that slides in with a <code>@starting-style</code> transition. Open with <code>showModal()</code>; close with <code>close()</code>, <code>Esc</code>, or a backdrop click. Inside: a <code>&lt;header&gt;</code> (brand + close), a <code>&lt;nav&gt;</code> (links + optional <code>&lt;h5&gt;</code> group headings), an optional <code>&lt;footer&gt;</code>.',
      play: {
        state: { side: 'left' },
        controls: [
          { type: 'select', key: 'side', label: 'Edge', options: [{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }] },
        ],
        render: function (s) {
          return (
            '<button onclick="this.nextElementSibling.showModal()">Open ' + s.side + ' drawer</button>\n\n' +
            '<dialog class="' + s.side + '">\n' +
            '  <header>\n    <a>VANTA<b>UI</b></a>\n' +
            '    <button class="icon" aria-label="Close"\n      onclick="this.closest(\'dialog\').close()"><i>close</i></button>\n  </header>\n' +
            '  <nav>\n' +
            '    <a class="active"><i>space_dashboard</i>Overview</a>\n' +
            '    <a><i>folder</i>Case Files</a>\n' +
            '    <a><i>map</i>City Map</a>\n' +
            '    <a><i>handyman</i>Loadout</a>\n' +
            '    <span class="max"></span>\n  </nav>\n' +
            '  <footer>\n    <button class="ghost block"\n      onclick="this.closest(\'dialog\').close()">Sign out</button>\n  </footer>\n' +
            '</dialog>'
          );
        },
      },
    },
    {
      group: 'Chrome',
      id: 'sidebar',
      title: 'Drawer sidebar',
      blurb:
        'A semantic <code>&lt;aside class="drawer"&gt;</code> (or <code>&lt;nav class="drawer"&gt;</code>) in an app frame is a wide, text-labelled sidebar — <strong>persistent on desktop, off-canvas on mobile</strong>, no media queries. Structure it like any drawer; add <code>right</code> to dock it trailing. A <code>&lt;button data-open="id"&gt;</code> toggles it (optional JS). <em>This page&rsquo;s own sidebar is one.</em>',
      examples: [
        {
          frame: true,
          code: '<aside class="drawer" id="demoDrawer">\n  <header>\n    <span><img src="assets/emblem.svg" alt="">VANTA<b>UI</b></span>\n    <button class="icon vui-until-m" data-close aria-label="Close"><i>close</i></button>\n  </header>\n  <nav>\n    <h6>Telemetry</h6>\n    <a class="active"><i>space_dashboard</i>Overview</a>\n    <a><i>radar</i>Scan</a>\n    <a><i>map</i>City Map</a>\n    <h6>System</h6>\n    <a><i>handyman</i>Loadout</a>\n    <a><i>settings</i>Setup</a>\n  </nav>\n  <footer>\n    <button class="ghost block"><i>logout</i>Sign out</button>\n  </footer>\n</aside>',
          demo: '<div class="vui" style="block-size:300px">\n  <aside class="drawer" id="demoDrawer">\n    <header>\n      <span><img src="assets/emblem.svg" alt="">VANTA<b>UI</b></span>\n      <button class="icon vui-until-m" data-close aria-label="Close"><i>close</i></button>\n    </header>\n    <nav>\n      <h6>Telemetry</h6>\n      <a class="active"><i>space_dashboard</i>Overview</a>\n      <a><i>radar</i>Scan</a>\n      <a><i>map</i>City Map</a>\n      <h6>System</h6>\n      <a><i>handyman</i>Loadout</a>\n      <a><i>settings</i>Setup</a>\n    </nav>\n    <footer>\n      <button class="ghost block"><i>logout</i>Sign out</button>\n    </footer>\n  </aside>\n  <header>\n    <button class="icon vui-until-m" data-open="demoDrawer" aria-label="Open menu"><i>menu</i></button>\n    <a>WAYNE<b>TECH</b></a>\n    <menu><button aria-label="Profile"><i>account_circle</i></button></menu>\n  </header>\n  <main>\n    <div class="vui-container">\n      <h1>Command Center</h1>\n      <p>The sidebar is pinned on desktop and collapses to an off-canvas drawer on phones — resize to see it switch.</p>\n    </div>\n  </main>\n</div>',
        },
      ],
    },

    /* ---------------- LAYOUT ---------------- */
    {
      group: 'Layout',
      id: 'grid',
      title: '12-column grid',
      blurb:
        'Mobile-first like BeerCSS: children stack on the smallest screen, then opt into spans with <code>vui-s* / vui-m* / vui-l*</code> (small / medium / large breakpoints).',
      examples: [
        {
          code: '<div class="vui-grid">\n  <article class="vui-s12 vui-m6 vui-l4">A</article>\n  <article class="vui-s12 vui-m6 vui-l4">B</article>\n  <article class="vui-s12 vui-m12 vui-l4">C</article>\n</div>',
        },
      ],
    },
    {
      group: 'Layout',
      id: 'autogrid',
      title: 'Auto grid',
      blurb:
        '<code>vui-autogrid</code> is the responsive-by-default card flow: it fits as many cards as the space allows at your <code>--vui-min</code> width, then reflows to a single full-width card on a phone — no breakpoints. Add <code>--fit</code> so a short last row stretches to fill.',
      play: {
        state: { min: 13, fit: false },
        controls: [
          { type: 'range', key: 'min', label: 'Min card', min: 7, max: 22, suffix: 'rem' },
          { type: 'toggle', key: 'fit', label: 'Stretch last row (--fit)' },
        ],
        render: function (s) {
          var cls = 'vui-autogrid' + (s.fit ? ' vui-autogrid--fit' : '');
          return (
            '<div class="' + cls + '" style="--vui-min:' + s.min + 'rem">\n' +
            '  <article>Sector 14-C</article>\n' +
            '  <article>Sector 22-A</article>\n' +
            '  <article>Sector 09-F</article>\n' +
            '  <article>Sector 31-B</article>\n' +
            '</div>'
          );
        },
      },
    },
    {
      group: 'Layout',
      id: 'prose',
      title: 'Prose layout',
      blurb:
        '<code>vui-prose</code> is a responsive grid for long-form text. It centres copy to a readable measure (65ch) while letting images, figures, blockquotes and code bleed wider. Use <code>bleed</code> to widen to the container sides, <code>bleed-full</code> to go edge-to-edge.',
      examples: [
        {
          code: '<article class="vui-prose">\n  <h1>Knightfall Protocol</h1>\n  <p class="vui-eyebrow">Security Level: Classified</p>\n  <p>To preserve the security of Gotham City, the Knightfall Protocol has been established as a final contingency. In the event of primary identity compromise, all core assets are to be decommissioned.</p>\n\n  <blockquote>"The city needs a legend. Something worse than me."</blockquote>\n\n  <figure class="bleed">\n    <img src="preview.png" alt="Tactical HUD preview" style="aspect-ratio:16/9;object-fit:cover">\n    <figcaption>Fig. 01 — VantaUI Tactical HUD telemetry.</figcaption>\n  </figure>\n\n  <p>All field agents are instructed to stand down. All communication links will be terminated.</p>\n</article>',
        },
      ],
    },

    /* ---------------- COMPONENTS ---------------- */
    {
      group: 'Components',
      id: 'buttons',
      title: 'Buttons',
      blurb:
        'A bare <code>&lt;button&gt;</code> is a chamfered outline control; <code>type="submit"</code> (the <em>Filled</em> style) auto-promotes to the primary CTA. Re-tone or resize with one word; a lone <code>&lt;i&gt;</code> collapses it to a square.',
      play: {
        state: { style: '', tone: '', size: '', icon: false, block: false, disabled: false },
        controls: [
          { type: 'select', key: 'style', label: 'Style', options: [{ label: 'Outline', value: '' }, { label: 'Filled', value: 'fill' }, { label: 'Ghost', value: 'ghost' }] },
          { type: 'select', key: 'tone', label: 'Tone', options: [{ label: 'Cyan', value: '' }, { label: 'Amber', value: 'amber' }, { label: 'Danger', value: 'danger' }, { label: 'Secure', value: 'secure' }] },
          { type: 'select', key: 'size', label: 'Size', options: [{ label: 'Medium', value: '' }, { label: 'Small', value: 'small' }, { label: 'Large', value: 'large' }] },
          { type: 'toggle', key: 'icon', label: 'Icon only' },
          { type: 'toggle', key: 'block', label: 'Full width' },
          { type: 'toggle', key: 'disabled', label: 'Disabled' },
        ],
        render: function (s) {
          var isFill = s.style === 'fill';
          var c = [];
          if (s.style === 'ghost') c.push('ghost');
          if (s.tone) c.push(s.tone);
          if (s.size) c.push(s.size);
          if (s.icon) c.push('icon');
          else if (s.block) c.push('block');
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          var type = isFill && !s.icon ? ' type="submit"' : '';
          var dis = s.disabled ? ' disabled' : '';
          if (s.icon) return '<button' + type + cls + dis + ' aria-label="Scan"><i>radar</i></button>';
          return '<button' + type + cls + dis + '>Authorize</button>';
        },
      },
    },
    {
      group: 'Components',
      id: 'panels',
      title: 'Panels',
      blurb:
        'A bare <code>&lt;article&gt;</code> is a chamfered plate; a nested <code>&lt;header&gt;</code>/<code>&lt;footer&gt;</code> auto-spans with a hairline divider. Tune depth, tint and intensity independently and combine freely.',
      play: {
        state: { surface: '', tint: '', intensity: '', glow: false, notch: false, brackets: false, sections: false },
        controls: [
          { type: 'select', key: 'surface', label: 'Surface', options: [{ label: 'Panel', value: '' }, { label: 'Raised', value: 'raised' }, { label: 'Inset', value: 'inset' }, { label: 'Flat', value: 'flat' }] },
          { type: 'select', key: 'tint', label: 'Tint', options: [{ label: 'None', value: '' }, { label: 'Cyan', value: 'cyan' }, { label: 'Amber', value: 'amber' }, { label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }] },
          { type: 'select', key: 'intensity', label: 'Intensity', options: [{ label: 'Default', value: '' }, { label: 'Dim', value: 'dim' }, { label: 'Vivid', value: 'vivid' }] },
          { type: 'toggle', key: 'glow', label: 'Glow' },
          { type: 'toggle', key: 'notch', label: 'Notch' },
          { type: 'toggle', key: 'brackets', label: 'Brackets' },
          { type: 'toggle', key: 'sections', label: 'Header & footer' },
        ],
        render: function (s) {
          var c = [s.surface, s.tint, s.intensity, s.glow && 'glow', s.notch && 'notch', s.brackets && 'brackets'].filter(Boolean);
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          if (s.sections) {
            return (
              '<article' + cls + '>\n' +
              '  <header>\n    <small class="vui-eyebrow">Case File</small>\n    <small>14-C</small>\n  </header>\n' +
              '  <p>Recovered intel from the broker drop. Chain of custody verified.</p>\n' +
              '  <footer><button class="small">Open</button></footer>\n' +
              '</article>'
            );
          }
          return '<article' + cls + '>\n  <p>Recovered intel from the broker drop. Chain of custody verified.</p>\n</article>';
        },
      },
    },
    {
      group: 'Components',
      id: 'badges',
      title: 'Badges',
      blurb:
        'Notched status tags on a <code>&lt;span&gt;</code>, <code>&lt;a&gt;</code> or <code>&lt;mark&gt;</code>. Tone with one word; add <code>dot</code> for a live indicator or <code>solid</code> to fill.',
      play: {
        state: { tone: 'cyan', dot: false, solid: false },
        controls: [
          { type: 'select', key: 'tone', label: 'Tone', options: [{ label: 'Cyan', value: 'cyan' }, { label: 'Amber', value: 'amber' }, { label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }, { label: 'Neutral', value: 'neutral' }] },
          { type: 'toggle', key: 'dot', label: 'Live dot' },
          { type: 'toggle', key: 'solid', label: 'Solid fill' },
        ],
        render: function (s) {
          var c = ['badge', s.tone, s.dot && 'dot', s.solid && 'solid'].filter(Boolean);
          return '<span class="' + c.join(' ') + '">Online</span>';
        },
      },
    },
    {
      group: 'Components',
      id: 'forms',
      title: 'Forms',
      blurb:
        'Native controls are styled directly — no wrappers. A <code>&lt;label&gt;</code> wrapping a field stacks it (leading <code>&lt;span&gt;</code> label, trailing <code>&lt;small&gt;</code> hint; add <code>error</code> to the hint when <code>aria-invalid</code>). The single field below is live; switches, checkboxes, radios and the range slider follow.',
      play: {
        state: { type: 'password', invalid: false, disabled: false, hint: true },
        controls: [
          { type: 'select', key: 'type', label: 'Field', options: [{ label: 'Text', value: 'text' }, { label: 'Password', value: 'password' }, { label: 'Select', value: 'select' }, { label: 'Textarea', value: 'textarea' }] },
          { type: 'toggle', key: 'invalid', label: 'Invalid' },
          { type: 'toggle', key: 'disabled', label: 'Disabled' },
          { type: 'toggle', key: 'hint', label: 'Hint' },
        ],
        render: function (s) {
          var inv = s.invalid ? ' aria-invalid="true"' : '';
          var dis = s.disabled ? ' disabled' : '';
          var control;
          if (s.type === 'select') {
            control = '<select' + inv + dis + ">\n    <option>Bleake Island</option>\n    <option>Miagani</option>\n    <option>Founders'</option>\n  </select>";
          } else if (s.type === 'textarea') {
            control = '<textarea placeholder="Field report…"' + inv + dis + '></textarea>';
          } else {
            var val = s.type === 'password' ? 'wayne' : 'b.wayne';
            control = '<input type="' + s.type + '" placeholder="••••••••" value="' + val + '"' + inv + dis + '>';
          }
          var hint = s.hint
            ? '\n  <small' + (s.invalid ? ' class="error"' : '') + '>' + (s.invalid ? 'Access denied — code rejected.' : '8–32 characters.') + '</small>'
            : '';
          return '<label>\n  <span>Access code</span>\n  ' + control + hint + '\n</label>';
        },
      },
      examples: [
        {
          code: '<label><input type="checkbox" role="switch" checked> Detective Mode</label>\n<label><input type="checkbox" checked> Mark case solved</label>\n<label><input type="radio" name="d" checked> Normal</label>\n<label><input type="radio" name="d"> Knightmare</label>',
        },
        {
          code: '<label>\n  <span>Frequency</span>\n  <input type="range" min="0" max="100" value="62">\n</label>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'alerts',
      title: 'Alerts',
      blurb:
        'Inline system notices with an accent rail + glyph. <code>[role="status"]</code> reads as info, <code>[role="alert"]</code> as threat. Re-tone with one word; a nested <code>&lt;strong&gt;</code> becomes the title. Override the glyph with <code>--vui-alert-glyph</code>.',
      play: {
        state: { role: 'status', tone: '', title: true },
        controls: [
          { type: 'select', key: 'role', label: 'Role', options: [{ label: 'status', value: 'status' }, { label: 'alert', value: 'alert' }] },
          { type: 'select', key: 'tone', label: 'Tone', options: [{ label: 'Default', value: '' }, { label: 'Info', value: 'info' }, { label: 'Warn', value: 'warn' }, { label: 'Threat', value: 'threat' }, { label: 'Secure', value: 'secure' }] },
          { type: 'toggle', key: 'title', label: 'Title' },
        ],
        render: function (s) {
          var cls = s.tone ? ' class="' + s.tone + '"' : '';
          var title = s.title ? '\n  <strong>Uplink status</strong>' : '';
          var body = s.role === 'alert' ? '\n  12 contacts · grid 14-C · ETA 2m\n' : '\n  Channel encrypted end-to-end.\n';
          return '<div role="' + s.role + '"' + cls + '>' + title + body + '</div>';
        },
      },
    },
    {
      group: 'Components',
      id: 'meters',
      title: 'Meters & progress',
      blurb:
        'The <code>.meter</code> helper is a labelled, accent-toned bar driven purely by <code>--value</code> — the readout renders from a CSS counter, no JS. Tone it, or add <code>segmented</code> for ticks. Native <code>&lt;meter&gt;</code> (threshold-coloured) and <code>&lt;progress&gt;</code> are restyled too; add <code>data-animate</code> (with the JS helper) to count up on view.',
      play: {
        state: { tone: '', segmented: false, value: 73 },
        controls: [
          { type: 'select', key: 'tone', label: 'Tone', options: [{ label: 'Cyan', value: '' }, { label: 'Amber', value: 'amber' }, { label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }] },
          { type: 'toggle', key: 'segmented', label: 'Segmented' },
          { type: 'range', key: 'value', label: 'Value', min: 0, max: 100 },
        ],
        render: function (s) {
          var c = ['meter', s.tone, s.segmented && 'segmented'].filter(Boolean);
          return '<div class="' + c.join(' ') + '" style="--value:' + s.value + '">\n  <span>Suit Integrity</span>\n  <b></b>\n</div>';
        },
      },
      examples: [
        {
          code: '<meter min="0" max="100" low="30" high="70" optimum="100" value="86"></meter>\n<progress max="100" value="62"></progress>',
        },
        {
          label: 'Counts up on view — data-animate (optional JS)',
          code: '<div class="meter amber" data-value="62" data-animate style="--value:0">\n  <span>Threat Level</span>\n  <b></b>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'gauge',
      title: 'Radial gauge',
      blurb:
        'A 270° arc readout built from a single conic-gradient — no SVG, no JS. The value renders from <code>--value</code>; leave <code>&lt;b&gt;</code> empty and a counter fills it. Size with <code>small · large</code>, tone with a colour word.',
      play: {
        state: { size: '', tone: '', value: 87 },
        controls: [
          { type: 'select', key: 'size', label: 'Size', options: [{ label: 'Medium', value: '' }, { label: 'Small', value: 'small' }, { label: 'Large', value: 'large' }] },
          { type: 'select', key: 'tone', label: 'Tone', options: [{ label: 'Cyan', value: '' }, { label: 'Amber', value: 'amber' }, { label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }] },
          { type: 'range', key: 'value', label: 'Value', min: 0, max: 100 },
        ],
        render: function (s) {
          var c = ['gauge', s.size, s.tone].filter(Boolean);
          return '<div class="' + c.join(' ') + '" style="--value:' + s.value + '">\n  <b></b><small>%</small>\n  <span>Integrity</span>\n</div>';
        },
      },
    },
    {
      group: 'Components',
      id: 'tabs',
      title: 'Tabs',
      blurb:
        'Semantic <code>nav[role=tablist]</code> + <code>button[role=tab]</code>. The optional JS wires clicks, arrow keys, and panel visibility via <code>aria-controls</code>. A trailing <code>&lt;small&gt;</code> is a count chip.',
      examples: [
        {
          code: '<nav role="tablist">\n  <button role="tab" aria-controls="t-cases" aria-selected="true">Case Files <small>7</small></button>\n  <button role="tab" aria-controls="t-map">City Map</button>\n  <button role="tab" aria-controls="t-gear">Loadout</button>\n</nav>\n<div role="tabpanel" id="t-cases">Seven open cases in the active sweep.</div>\n<div role="tabpanel" id="t-map" hidden>City map module offline.</div>\n<div role="tabpanel" id="t-gear" hidden>Three gadgets equipped.</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'disclosure',
      title: 'Accordion',
      blurb:
        'Native <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> styled as a chamfered, zero-JS disclosure — and it animates open on browsers that support <code>::details-content</code>.',
      examples: [
        {
          code: '<details open>\n  <summary>Mission briefing</summary>\n  Intercept the broker at pier 14-C before the data drive changes hands.\n</details>\n<details>\n  <summary>Known associates</summary>\n  Ironhand · The Chemist · Night Courier.\n</details>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'table',
      title: 'Tables',
      blurb:
        'A semantic <code>&lt;table&gt;</code> becomes a telemetry grid: uppercase eyebrow headers, hairline rows, cyan hover. Mark numeric cells with <code>data-num</code>; tint a row with a colour word. Tune density and rules below; wrap in <code>.scroll</code> for overflow on phones.',
      play: {
        state: { density: '', striped: false, ruled: false, opaque: false, flat: false, wrap: false },
        controls: [
          { type: 'select', key: 'density', label: 'Density', options: [{ label: 'Default', value: '' }, { label: 'Compact', value: 'compact' }, { label: 'Relaxed', value: 'relaxed' }] },
          { type: 'toggle', key: 'striped', label: 'Striped' },
          { type: 'toggle', key: 'ruled', label: 'Column rules' },
          { type: 'toggle', key: 'opaque', label: 'Opaque' },
          { type: 'toggle', key: 'flat', label: 'No hover' },
          { type: 'toggle', key: 'wrap', label: 'Wrap cells' },
        ],
        render: function (s) {
          var c = [s.density, s.striped && 'striped', s.ruled && 'ruled', s.opaque && 'opaque', s.flat && 'flat', s.wrap && 'wrap'].filter(Boolean);
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          return (
            '<div class="scroll">\n' +
            '<table' + cls + '>\n' +
            '  <caption>District status</caption>\n' +
            '  <thead><tr><th>Sector</th><th>Status</th><th data-num>Threat</th></tr></thead>\n' +
            '  <tbody>\n' +
            '    <tr><td>Bleake Island</td><td>Contested</td><td data-num>64</td></tr>\n' +
            '    <tr class="red"><td>Miagani</td><td>Hostile</td><td data-num>86</td></tr>\n' +
            "    <tr><td>Founders'</td><td>Secure</td><td data-num>38</td></tr>\n" +
            '  </tbody>\n' +
            '</table>\n' +
            '</div>'
          );
        },
      },
    },
    {
      group: 'Components',
      id: 'overlays',
      title: 'Dialog, tooltip, divider',
      blurb:
        'Native <code>&lt;dialog&gt;</code> as a chamfered modal with a scrim, a hover/focus tooltip (<code>[data-tip]</code>), a labelled <code>.divider</code>, and <code>.kv</code> / <code>.stat</code> readouts (tone a stat with <code>signal</code> or <code>amber</code>).',
      examples: [
        {
          code: '<button onclick="this.nextElementSibling.showModal()">Open dialog</button>\n<dialog>\n  <header>\n    <small class="vui-eyebrow">Confirm</small>\n    <button class="icon" aria-label="Close" onclick="this.closest(\'dialog\').close()"><i>close</i></button>\n  </header>\n  <div>Engage the Knightfall protocol?</div>\n  <footer>\n    <button class="ghost" onclick="this.closest(\'dialog\').close()">Cancel</button>\n    <button type="submit" class="danger" onclick="this.closest(\'dialog\').close()">Engage</button>\n  </footer>\n</dialog>',
        },
        {
          code: '<span data-tip="Decryption in progress" tabindex="0">\n  <button class="icon" aria-label="Locked"><i>lock</i></button>\n</span>\n<div class="divider" data-label="Sector 14-C" style="margin-block:16px"></div>\n<div class="kv"><span>Operator</span><span>B. Wayne</span></div>\n<div class="stat signal"><b>98.6</b><span>Integrity</span></div>',
        },
      ],
    },

    /* ---------------- PATTERNS ---------------- */
    {
      group: 'Patterns',
      id: 'appshell',
      title: 'App shell',
      blurb:
        'Any <code>.vui</code> element holding a <code>&lt;main&gt;</code> becomes an app frame and places its landmarks by element. Add a <code>&lt;nav class="left"&gt;</code> for a narrow side rail, or a semantic <code>&lt;aside class="drawer"&gt;</code> for a wide sidebar. Shown here boxed.',
      examples: [
        {
          frame: true,
          code: '<body class="vui">\n  <nav class="left" aria-label="Rail">\n    <img src="emblem.svg" alt="">\n    <a class="active"><i>space_dashboard</i>Ops</a>\n    <a><i>folder</i>Files</a>\n    <a><i>handyman</i>Tools</a>\n    <span class="max"></span>\n    <a><i>settings</i>Setup</a>\n  </nav>\n  <header>\n    <a>WAYNE<b>TECH</b></a>\n    <nav><a aria-current="page">Overview</a><a>Cases</a></nav>\n    <menu>\n      <span class="badge green dot">Online</span>\n      <button aria-label="User"><i>account_circle</i></button>\n    </menu>\n  </header>\n  <main>\n    <h1>Command Center</h1>\n    <p>Operational overview · night cycle 02:14</p>\n    <div class="vui-autogrid" style="--vui-min:10rem">\n      <article><div class="stat signal"><b>07</b><span>Active cases</span></div></article>\n      <article><div class="stat amber"><b>12</b><span>Hostiles</span></div></article>\n      <article><div class="stat"><b>04:18</b><span>Elapsed</span></div></article>\n    </div>\n  </main>\n</body>',
          demo: '<div class="vui" style="block-size:300px">\n  <nav class="left" aria-label="Rail">\n    <img src="assets/emblem.svg" alt="">\n    <a class="active"><i>space_dashboard</i>Ops</a>\n    <a><i>folder</i>Files</a>\n    <a><i>handyman</i>Tools</a>\n    <span class="max"></span>\n    <a><i>settings</i>Setup</a>\n  </nav>\n  <header>\n    <a>WAYNE<b>TECH</b></a>\n    <nav><a aria-current="page">Overview</a><a>Cases</a></nav>\n    <menu>\n      <span class="badge green dot">Online</span>\n      <button aria-label="User"><i>account_circle</i></button>\n    </menu>\n  </header>\n  <main>\n    <h1>Command Center</h1>\n    <p>Operational overview · night cycle 02:14</p>\n    <div class="vui-autogrid" style="--vui-min:10rem">\n      <article><div class="stat signal"><b>07</b><span>Active cases</span></div></article>\n      <article><div class="stat amber"><b>12</b><span>Hostiles</span></div></article>\n      <article><div class="stat"><b>04:18</b><span>Elapsed</span></div></article>\n    </div>\n  </main>\n</div>',
        },
      ],
    },
    {
      group: 'Patterns',
      id: 'js',
      title: 'JavaScript helpers',
      blurb:
        'Optional and zero-dependency. <code>VantaUI.init()</code> runs on load; call it again after injecting markup. <code>VantaUI.setValue(el, n)</code> animates a meter/gauge; <code>VantaUI.drawers()</code> wires <code>data-open</code>/<code>data-close</code>; <code>[data-vui-clock]</code> ticks live.',
      examples: [
        {
          noDemo: true,
          code: 'import VantaUI from "./js/vantaui.js";\n\n// re-scan after you inject DOM (frameworks, htmx, etc.)\nVantaUI.init(document);\n\n// animate a meter or gauge to a value\nVantaUI.setValue(document.querySelector(".gauge"), 87);\n\n// open / close drawers via [data-open="id"] / [data-close]\nVantaUI.drawers(document);\n\n// live clock — any element:\n// <span data-vui-clock>00:00:00</span>',
        },
      ],
    },
    {
      group: 'Patterns',
      id: 'vue',
      title: 'Vue & Nuxt',
      blurb:
        'Framework-agnostic by design, with first-class adapters. The Vue plugin adds <code>class="vui"</code> to the root and runs the helpers; the Nuxt module wires the CSS + client plugin for you.',
      examples: [
        {
          noDemo: true,
          code: "// Vue\nimport { createApp } from 'vue'\nimport VantaUI from 'vui-css/vue'\nimport 'vui-css'\ncreateApp(App).use(VantaUI).mount('#app')\n\n// Nuxt — nuxt.config.ts\nexport default defineNuxtConfig({\n  modules: ['vui-css/nuxt']\n})",
        },
      ],
    },
  ];

  /* ============================================================
     SYNTAX HIGHLIGHTER  (HTML + JS, zero-dependency)
     Tokenises raw source into escaped .tk-* spans; textContent of the
     result is still the plain code, so copy keeps working.
     ============================================================ */
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function tk(cls, text) {
    return '<span class="tk-' + cls + '">' + esc(text) + '</span>';
  }
  function hlAttrs(s) {
    return s.replace(/([\w-]+)(?:(=)("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g, function (_, name, eq, val) {
      var o = tk('attr', name);
      if (eq) o += tk('pun', '=');
      if (val) o += tk('str', val);
      return o;
    });
  }
  function hlHTML(code) {
    var re = /(<!--[\s\S]*?-->)|(<\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^<>])*?)(\/?>)/g;
    var out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      last = re.lastIndex;
      if (m[1]) out += tk('com', m[1]);
      else out += tk('pun', m[2]) + tk('tag', m[3]) + hlAttrs(m[4]) + tk('pun', m[5]);
    }
    return out + esc(code.slice(last));
  }
  function hlJS(code) {
    var re =
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|default|const|let|var|function|return|new|if|else|for|while|class|extends|async|await|true|false|null|undefined|this)\b|(\b\d+(?:\.\d+)?\b)/g;
    var out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      last = re.lastIndex;
      if (m[1]) out += tk('com', m[1]);
      else if (m[2]) out += tk('str', m[2]);
      else if (m[3]) out += tk('kw', m[3]);
      else out += tk('num', m[4]);
    }
    return out + esc(code.slice(last));
  }
  function highlight(code) {
    return /<[a-z!/]/i.test(code) ? hlHTML(code) : hlJS(code);
  }

  /* ============================================================
     CODE SIDEBAR  (one shared slide-in panel)
     Opens with the current variant's clean source; if it's already open
     for a given playground, it live-refreshes as you change controls.
     ============================================================ */
  var CodePanel = (function () {
    var root, titleEl, codeEl, copyBtn, owner = null, codeFn = null, ready = false, hideTimer;

    function ensure() {
      if (ready) return;
      root = document.getElementById('doc-codepanel');
      if (!root) return;
      titleEl = root.querySelector('.doc-codepanel__title');
      codeEl = root.querySelector('.doc-codepanel__pre code');
      copyBtn = root.querySelector('.doc-codepanel__copy');

      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-code-close]')) close();
      });
      copyBtn.addEventListener('click', function () {
        var text = codeEl.textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        var i = copyBtn.querySelector('i');
        i.textContent = 'check';
        copyBtn.classList.add('is-copied');
        setTimeout(function () {
          i.textContent = 'content_copy';
          copyBtn.classList.remove('is-copied');
        }, 1200);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) close();
      });
      ready = true;
    }

    function isOpen() {
      return root && root.classList.contains('is-open');
    }
    function fill(title, code) {
      titleEl.textContent = title;
      codeEl.innerHTML = highlight(code);
    }
    function open(id, title, fn) {
      ensure();
      if (!root) return;
      owner = id;
      codeFn = fn;
      fill(title, fn());
      clearTimeout(hideTimer);
      root.hidden = false;
      // next frame so the slide-in transition runs from the closed state
      requestAnimationFrame(function () {
        root.classList.add('is-open');
      });
    }
    function refresh(id, title, fn) {
      if (isOpen() && owner === id) {
        codeFn = fn;
        fill(title, fn());
      }
    }
    function close() {
      if (!root) return;
      root.classList.remove('is-open');
      owner = null;
      hideTimer = setTimeout(function () {
        if (!isOpen()) root.hidden = true;
      }, 320);
    }
    return { open: open, refresh: refresh, close: close };
  })();

  /* ============================================================
     RENDERER
     ============================================================ */
  function el(tag, cls) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  /* ---- a single playground control (select / toggle / range) ---- */
  function controlNode(ctrl, state, onChange) {
    if (ctrl.type === 'toggle') {
      var lab = el('label', 'doc-ctrl doc-ctrl--toggle');
      var box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = !!state[ctrl.key];
      box.addEventListener('change', function () {
        state[ctrl.key] = box.checked;
        onChange();
      });
      lab.appendChild(box);
      lab.appendChild(document.createTextNode(' ' + ctrl.label));
      return lab;
    }
    if (ctrl.type === 'range') {
      var rlab = el('label', 'doc-ctrl');
      var span = el('span');
      span.innerHTML = ctrl.label + ' <b>' + state[ctrl.key] + (ctrl.suffix || '') + '</b>';
      var val = span.querySelector('b');
      var range = document.createElement('input');
      range.type = 'range';
      range.min = ctrl.min;
      range.max = ctrl.max;
      range.value = state[ctrl.key];
      range.addEventListener('input', function () {
        state[ctrl.key] = Number(range.value);
        val.textContent = range.value + (ctrl.suffix || '');
        onChange();
      });
      rlab.appendChild(span);
      rlab.appendChild(range);
      return rlab;
    }
    /* select */
    var slab = el('label', 'doc-ctrl');
    var s = el('span');
    s.textContent = ctrl.label;
    var sel = document.createElement('select');
    ctrl.options.forEach(function (o) {
      var op = document.createElement('option');
      op.value = o.value;
      op.textContent = o.label;
      if (String(state[ctrl.key]) === String(o.value)) op.selected = true;
      sel.appendChild(op);
    });
    sel.addEventListener('change', function () {
      state[ctrl.key] = sel.value;
      onChange();
    });
    slab.appendChild(s);
    slab.appendChild(sel);
    return slab;
  }

  /* ---- a configurator: live stage + controls + view-code ---- */
  function playgroundNode(sec) {
    var play = sec.play;
    var state = Object.assign({}, play.state);

    var wrap = el('div', 'doc-play bleed');
    var stage = el('div', 'doc-demo doc-play__stage' + (play.frame ? ' doc-play__stage--frame' : ''));
    var panel = el('div', 'doc-play__panel');
    var controls = el('div', 'doc-play__controls');

    function code() {
      return play.render(state);
    }
    function paint() {
      stage.innerHTML = code();
      if (window.vui && window.vui.init) window.vui.init(stage);
      CodePanel.refresh(sec.id, sec.title, code);
    }

    play.controls.forEach(function (c) {
      controls.appendChild(controlNode(c, state, paint));
    });

    var view = el('button', 'doc-viewcode');
    view.type = 'button';
    view.innerHTML = '<i>code</i><span>View code</span>';
    view.addEventListener('click', function () {
      CodePanel.open(sec.id, sec.title, code);
    });

    panel.appendChild(controls);
    panel.appendChild(view);
    wrap.appendChild(stage);
    wrap.appendChild(panel);
    paint();
    return wrap;
  }

  var exUid = 0;

  /* ---- a static example: live demo + view-code (or inline code for snippets) ---- */
  function exampleNode(ex, sec) {
    var wrap = el('div', 'doc-example bleed');

    if (ex.noDemo) {
      /* reference snippet — keep the code inline, it IS the content */
      wrap.innerHTML =
        '<div class="doc-code">' +
        '<button class="doc-copy" type="button" aria-label="Copy code"><i>content_copy</i></button>' +
        '<pre><code>' + highlight(ex.code) + '</code></pre>' +
        '</div>';
      return wrap;
    }

    var demo = el('div', 'doc-demo' + (ex.frame ? ' doc-demo--frame' : ''));
    demo.innerHTML = ex.demo || ex.code;
    wrap.appendChild(demo);

    var foot = el('div', 'doc-example__foot');
    if (ex.label) {
      var l = el('span', 'doc-example__label');
      l.textContent = ex.label;
      foot.appendChild(l);
    }
    var view = el('button', 'doc-viewcode');
    view.type = 'button';
    view.innerHTML = '<i>code</i><span>View code</span>';
    var id = 'ex' + ++exUid;
    var src = ex.code;
    view.addEventListener('click', function () {
      CodePanel.open(id, sec.title, function () {
        return src;
      });
    });
    foot.appendChild(view);
    wrap.appendChild(foot);
    return wrap;
  }

  function render() {
    var main = document.getElementById('doc-main');
    var nav = document.getElementById('doc-nav');
    var groups = {};
    var order = [];

    SECTIONS.forEach(function (sec) {
      var s = el('section', 'doc-section vui-prose');
      s.id = sec.id;
      s.innerHTML =
        '<div class="doc-section__head">' +
        '<h2 class="doc-section__title">' + sec.title + '</h2>' +
        (sec.blurb ? '<p class="doc-section__blurb">' + sec.blurb + '</p>' : '') +
        '</div>';

      if (sec.render) {
        var custom = el('div', 'doc-tokens bleed');
        custom.innerHTML = sec.render();
        s.appendChild(custom);
      }
      if (sec.play) s.appendChild(playgroundNode(sec));
      (sec.examples || []).forEach(function (ex) {
        s.appendChild(exampleNode(ex, sec));
      });
      main.appendChild(s);

      if (!groups[sec.group]) {
        groups[sec.group] = [];
        order.push(sec.group);
      }
      groups[sec.group].push(sec);
    });

    order.forEach(function (g) {
      var h6 = document.createElement('h6');
      h6.textContent = g;
      nav.appendChild(h6);
      groups[g].forEach(function (sec) {
        var a = document.createElement('a');
        a.href = '#' + sec.id;
        a.dataset.target = sec.id;
        a.textContent = sec.title;
        nav.appendChild(a);
      });
    });
  }

  /* copy buttons on inline reference snippets */
  function wireCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.doc-copy');
      if (!btn) return;
      var codeNode = btn.parentNode.querySelector('code');
      if (!codeNode) return;
      navigator.clipboard && navigator.clipboard.writeText(codeNode.textContent);
      var i = btn.querySelector('i');
      var prev = i.textContent;
      i.textContent = 'check';
      btn.classList.add('is-copied');
      setTimeout(function () {
        i.textContent = prev;
        btn.classList.remove('is-copied');
      }, 1200);
    });
  }

  /* scrollspy — highlight active nav link */
  function wireSpy() {
    var links = [].slice.call(document.querySelectorAll('aside.drawer nav a'));
    var map = {};
    links.forEach(function (l) {
      map[l.dataset.target] = l;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove('active');
            });
            var active = map[en.target.id];
            if (active) active.classList.add('active');
          }
        });
      },
      { rootMargin: '-12% 0px -78% 0px', threshold: 0 },
    );
    document.querySelectorAll('.doc-section').forEach(function (s) {
      io.observe(s);
    });
  }

  function boot() {
    render();
    wireCopy();
    wireSpy();
    if (window.vui && window.vui.init) window.vui.init(document);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }

  /* test hook (Node): never runs in the browser, where `module` is undefined */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SECTIONS: SECTIONS, highlight: highlight };
  }
})();
