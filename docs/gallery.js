/* ============================================================
   VantaUI docs: gallery data + renderer.

   Two kinds of section content:
     • static examples: a live demo + a "view code" button. The demo can
       carry presentational scaffolding (a sized frame box) while the COPYABLE
       source stays clean: author `code` (clean, shown + copied) and an
       optional `demo` (the scaffolded preview). When `demo` is omitted the
       demo IS the clean code.
     • playgrounds: a live element you reconfigure with checkboxes/selects.
       A `render(state)` returns ONLY the component markup, so the preview, the
       copyable source, and the controls can never drift, and the code is clean
       by construction (no demo-only sizing leaks in).

   Opt a live demo into a resizable preview lane with `resize: true` (on a
   static example or on `play`): a grip on the trailing edge lets you shrink the
   preview and watch the component reflow. Off by default — reserve it for demos
   where responsiveness is the point (layout, carousel, app shell…).

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
    ['1', '2px'],
    ['2', '4px'],
    ['3', '8px'],
    ['4', '12px'],
    ['5', '16px'],
    ['6', '20px'],
    ['7', '24px'],
    ['8', '32px'],
    ['9', '40px'],
    ['10', '48px'],
    ['11', '64px'],
  ];

  function swatches(list, prefix) {
    return (
      '<div class="doc-swatches">' +
      list
        .map(function (name) {
          var dark = /(-50|-200|-300|-400|cyan-5|green-4|amber-3)/.test(name);
          return (
            '<div class="doc-swatch vui-chamfer" style="background:var(--' +
            name +
            ')">' +
            '<span class="doc-swatch__name" style="color:' +
            (dark ? 'var(--ink-900)' : 'var(--slate-50)') +
            '">' +
            (prefix || '') +
            name +
            '</span></div>'
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
            '<div class="doc-ref-item vui-notch"><code>' +
            name +
            '</code>' +
            (note ? '<small>' + note + '</small>' : '') +
            '</div>'
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
            '<div class="doc-ref-item vui-notch">' +
            it.sample +
            '<code>' +
            it.name +
            '</code></div>'
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
        'Three ingredients: <strong>Settings, Elements, Helpers</strong>. Add <code>class="vui"</code> to a root element and bare, semantic HTML (<code>header</code>, <code>nav</code>, <code>article</code>, <code>button</code>, <code>input</code>, <code>table</code>, <code>meter</code>, <code>dialog</code>…) comes alive with zero classes. Deviate from a default with one short <em>helper</em> word (<code>glow</code>, <code>danger</code>, <code>small</code>, <code>left</code>). Icons are <code>&lt;i&gt;home&lt;/i&gt;</code>. Everything ships inside <code>@layer</code>s at zero specificity, so your own styles always win.<br><br>Every component below is <strong>live</strong>: flip the checkboxes and selects to reconfigure it, then hit <strong>View code</strong> for the exact, copy-ready markup of that variant with nothing more.',
    },
    {
      group: 'Getting started',
      id: 'install',
      title: 'Install',
      blurb:
        'One stylesheet, one icon font. The optional JS adds tabs, drawers, the live clock, and meter/gauge animation, though the CSS is fully usable without it.',
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
          '<p class="doc-tok-h">Ink &amp; surfaces</p>' +
          swatches(INK, '--') +
          '<p class="doc-tok-h">Detective cyan: the signal</p>' +
          swatches(CYAN, '--') +
          '<p class="doc-tok-h">Amber, Red, Green: status</p>' +
          swatches(AMBER, '--') +
          swatches(RED, '--') +
          swatches(GREEN, '--') +
          '<p class="doc-tok-h">Cool neutrals / text</p>' +
          swatches(SLATE, '--')
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
          code: '<h1>Knightfall Protocol</h1>\n<h2>Detective Mode</h2>\n<h3>Gadget Loadout</h3>\n<p>Body copy in the UI voice: terse, operational, and system-to-operator.</p>',
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
        '8px grid. Corners are cut rather than rounded: the chamfer (cut top-left and bottom-right) and the four-corner notch are the signature silhouette. 2px is the maximum rounding you should ever see.<br><br>Two engines draw those cuts. <code>clip-path</code> is the universal fallback; on Chromium 139+ text-bearing plates upgrade to <code>border-radius</code> + <code>corner-shape</code>, which shapes only the box so content and dropdowns near the cut are never clipped. Force the fallback anywhere with <code>vui-clip</code> (on one element, or on a root to switch a whole subtree). The <strong>Shape / Clip</strong> button in the top bar flips this entire page between the two so you can compare.',
      render: function () {
        return (
          '<div class="doc-spaces">' +
          SPACE.map(function (s) {
            return (
              '<div class="doc-space"><span class="doc-space__bar" style="inline-size:' +
              s[1] +
              '"></span>' +
              '<span class="doc-space__tag">--space-' +
              s[0] +
              ' · ' +
              s[1] +
              '</span></div>'
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
        'The HUD building blocks every component is assembled from, which are also useful on their own. Apply the class to any element. Type roles (<code>vui-display/title/heading/readout/mono</code>) live under <a href="#type">Type</a>; below are the plates, frames, rules and textured backdrops.',
      render: function () {
        return (
          '<p class="doc-tok-h">Plates &amp; frames</p>' +
          '<div class="doc-ref-grid">' +
          '<div class="doc-ref-sample vui-chamfer"><div class="vui-chamfer" style="block-size:60px;border:1px solid var(--hairline-strong);background:var(--surface-panel)"></div><code>vui-chamfer</code></div>' +
          '<div class="doc-ref-sample vui-chamfer"><div class="vui-notch" style="block-size:60px;border:1px solid var(--hairline-strong);background:var(--surface-panel)"></div><code>vui-notch</code></div>' +
          '<div class="doc-ref-sample vui-chamfer"><div class="vui-brackets" style="block-size:60px;display:grid;place-items:center;color:var(--text-muted)">framed</div><code>vui-brackets</code></div>' +
          '</div>' +
          '<p class="doc-tok-h">Eyebrow · signal · rule</p>' +
          '<div class="doc-ref-grid">' +
          '<div class="doc-ref-sample vui-chamfer"><p class="vui-eyebrow" style="margin:0">System eyebrow</p><code>vui-eyebrow</code></div>' +
          '<div class="doc-ref-sample vui-chamfer"><p class="vui-signal" style="margin:0">SIGNAL 042.7</p><code>vui-signal</code></div>' +
          '<div class="doc-ref-sample vui-chamfer"><hr class="vui-rule" style="inline-size:100%"><code>vui-rule</code></div>' +
          '</div>' +
          '<p class="doc-tok-h">Textured backdrops</p>' +
          '<div class="doc-ref-grid">' +
          '<div class="doc-ref-sample vui-chamfer"><div class="vui-bg-grid" style="block-size:64px;border:1px solid var(--hairline)"></div><code>vui-bg-grid</code></div>' +
          '<div class="doc-ref-sample vui-chamfer"><div class="vui-bg-scan" style="block-size:64px;border:1px solid var(--hairline)"></div><code>vui-bg-scan</code></div>' +
          '<div class="doc-ref-sample vui-chamfer"><div class="vui-bg-hud" style="block-size:64px;border:1px solid var(--hairline)"></div><code>vui-bg-hud</code></div>' +
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
        'A focused, BeerCSS-sized helper set rather than a Tailwind-scale explosion. All <code>vui-</code> prefixed, logical-property based, and living in the <code>utilities</code> layer so they win on ties but never on your own styles. Spacing follows the 8px scale (index → <code>--space-N</code>).',
      render: function () {
        var size = function (n) {
          return {name: n, sample: '<span class="' + n + '" style="line-height:1">Aa</span>'};
        };
        var color = function (n) {
          return {name: n, sample: '<span class="' + n + '" style="font-weight:600">Aa 042</span>'};
        };
        var glow = function (n) {
          return {
            name: n,
            sample:
              '<span class="' +
              n +
              '" style="display:inline-block;inline-size:26px;block-size:26px;background:var(--surface-panel);border:1px solid var(--hairline-strong)"></span>',
          };
        };
        var surf = function (n) {
          return {
            name: n,
            sample:
              '<span class="' +
              n +
              '" style="display:inline-block;inline-size:26px;block-size:26px;border:1px solid var(--hairline-strong)"></span>',
          };
        };
        return (
          '<p class="doc-tok-h">Display</p>' +
          refChips([
            'vui-flex',
            'vui-inline-flex',
            'vui-grid-d',
            'vui-block',
            'vui-inline-block',
            'vui-inline',
            'vui-contents',
            'vui-hidden',
            'vui-sr-only',
          ]) +
          '<p class="doc-tok-h">Flex &amp; alignment</p>' +
          refChips([
            'vui-flex-row',
            'vui-flex-col',
            'vui-wrap',
            'vui-nowrap',
            'vui-flex-1',
            'vui-grow',
            'vui-shrink-0',
            'vui-items-start',
            'vui-items-center',
            'vui-items-end',
            'vui-items-stretch',
            'vui-items-baseline',
            'vui-justify-start',
            'vui-justify-center',
            'vui-justify-end',
            'vui-justify-between',
            'vui-justify-around',
          ]) +
          '<p class="doc-tok-h">Layout helpers</p>' +
          refChips([
            ['vui-row', 'flex row, centered'],
            ['vui-row--wrap', 'wrapping row'],
            ['vui-col', 'flex column'],
            ['vui-stack', 'vertical rhythm'],
            ['vui-cluster', 'wrapping cluster'],
            ['vui-center', 'grid place-items'],
            ['vui-between', 'space-between'],
            ['vui-spacer', 'flex spacer'],
            ['vui-container', 'max-width + gutter'],
            ['vui-container--narrow', 'tighter measure'],
            ['vui-container--fluid', 'edge-to-edge'],
          ]) +
          '<p class="doc-tok-h">Gap · 8px scale</p>' +
          refChips([
            ['vui-gap-0', '0'],
            ['vui-gap-1', '2px'],
            ['vui-gap-2', '4px'],
            ['vui-gap-3', '8px'],
            ['vui-gap-4', '12px'],
            ['vui-gap-5', '16px'],
            ['vui-gap-6', '20px'],
            ['vui-gap-7', '24px'],
            ['vui-gap-8', '32px'],
          ]) +
          '<p class="doc-tok-h">Padding · <code>vui-p / vui-pi / vui-pb</code></p>' +
          refChips(['vui-p-0…8', 'vui-pi-0…8', 'vui-pb-0…8']) +
          '<p class="doc-tok-h">Margin · <code>vui-m / vui-mi / vui-mb / vui-mbe</code></p>' +
          refChips(['vui-m-0…6', 'vui-m-auto', 'vui-mi-auto', 'vui-mb-0…8', 'vui-mbe-3…6']) +
          '<p class="doc-tok-h">Font size · clamp() fluid</p>' +
          refTiles(
            [
              'vui-text-2xs',
              'vui-text-xs',
              'vui-text-sm',
              'vui-text-base',
              'vui-text-md',
              'vui-text-lg',
              'vui-text-xl',
              'vui-text-2xl',
              'vui-text-3xl',
              'vui-text-4xl',
              'vui-text-5xl',
            ].map(size),
          ) +
          '<p class="doc-tok-h">Text colour</p>' +
          refTiles(
            [
              'vui-text-primary',
              'vui-text-secondary',
              'vui-text-muted',
              'vui-text-faint',
              'vui-text-cyan',
              'vui-text-amber',
              'vui-text-red',
              'vui-text-green',
            ].map(color),
          ) +
          '<p class="doc-tok-h">Font · weight · tracking · align</p>' +
          refChips([
            'vui-font-display',
            'vui-font-ui',
            'vui-font-hud',
            'vui-font-mono',
            'vui-fw-light',
            'vui-fw-regular',
            'vui-fw-medium',
            'vui-fw-semibold',
            'vui-fw-bold',
            'vui-tracked',
            'vui-tracked-wider',
            'vui-tracked-widest',
            'vui-upper',
            'vui-text-start',
            'vui-text-center',
            'vui-text-end',
            'vui-truncate',
            'vui-nowrap-text',
          ]) +
          '<p class="doc-tok-h">Surfaces</p>' +
          refTiles(
            ['vui-bg-void', 'vui-bg-base', 'vui-bg-raised', 'vui-bg-panel', 'vui-bg-inset'].map(
              surf,
            ),
          ) +
          '<p class="doc-tok-h">Borders</p>' +
          refChips(['vui-border', 'vui-border-strong', 'vui-border-accent', 'vui-border-0']) +
          '<p class="doc-tok-h">Glows</p>' +
          refTiles(
            ['vui-glow-cyan', 'vui-glow-amber', 'vui-glow-red', 'vui-glow-green'].map(glow),
          ) +
          '<p class="doc-tok-h">Position · sizing · misc</p>' +
          refChips([
            'vui-relative',
            'vui-absolute',
            'vui-sticky',
            'vui-w-full',
            'vui-h-full',
            'vui-w-auto',
            'vui-min-w-0',
            'vui-overflow-auto',
            'vui-overflow-hidden',
            'vui-pointer',
            'vui-select-none',
            'vui-text-glow',
            'vui-flicker',
            'vui-scanning',
          ]) +
          '<p class="doc-tok-h">Responsive show / hide</p>' +
          refChips([
            ['vui-until-s', 'hide ≥ 36rem'],
            ['vui-from-s', 'hide &lt; 36rem'],
            ['vui-until-m', 'hide ≥ 48rem'],
            ['vui-from-m', 'hide &lt; 48rem'],
            ['vui-until-l', 'hide ≥ 64rem'],
            ['vui-from-l', 'hide &lt; 64rem'],
            ['vui-until-xl', 'hide ≥ 80rem'],
            ['vui-from-xl', 'hide &lt; 80rem'],
          ])
        );
      },
    },

    /* ---------------- CHROME ---------------- */
    {
      group: 'Chrome',
      id: 'header',
      title: 'Header / app bar',
      blurb:
        'A <code>&lt;header&gt;</code> containing a <code>&lt;nav&gt;</code> becomes an app bar with no class required. The first <code>&lt;a&gt;</code> is the brand; the first <code>&lt;nav&gt;</code> pushes trailing actions right; a <code>&lt;form role="search"&gt;</code> is the search shell; a <code>&lt;menu&gt;</code> is the trailing cluster. A container query collapses the nav to a burger when the bar itself is narrow.',
      play: {
        resize: true,
        state: {tone: '', shape: '', align: '', size: '', sticky: false, search: false},
        controls: [
          {
            type: 'select',
            key: 'tone',
            label: 'Surface',
            options: [
              {label: 'Default', value: ''},
              {label: 'Glow', value: 'glow'},
              {label: 'Bare', value: 'bare'},
            ],
          },
          {
            type: 'select',
            key: 'shape',
            label: 'Shape',
            options: [
              {label: 'Attached', value: ''},
              {label: 'Float', value: 'float'},
            ],
          },
          {
            type: 'select',
            key: 'align',
            label: 'Nav',
            options: [
              {label: 'Leading', value: ''},
              {label: 'Centered', value: 'center'},
            ],
          },
          {
            type: 'select',
            key: 'size',
            label: 'Height',
            options: [
              {label: 'Default', value: ''},
              {label: 'Tall', value: 'tall'},
            ],
          },
          {type: 'toggle', key: 'search', label: 'Search field'},
          {type: 'toggle', key: 'sticky', label: 'Sticky'},
        ],
        render: function (s) {
          var c = [s.tone, s.shape, s.align, s.size, s.sticky && 'sticky'].filter(Boolean);
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          var search = s.search
            ? '\n  <form role="search">\n    <i>search</i>\n    <input type="search" placeholder="Search sectors…">\n  </form>'
            : '';
          return (
            '<header' +
            cls +
            '>\n' +
            '  <a>VANTA<b>UI</b></a>\n' +
            '  <nav>\n    <a aria-current="page">Command</a>\n    <a>Intel</a>\n    <a>Comms</a>\n  </nav>' +
            search +
            '\n' +
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
        'A bare <code>&lt;footer&gt;</code> (outside an <code>&lt;article&gt;</code>/<code>&lt;dialog&gt;</code>) is the page footer. Pick a shape: the default hairline strip, <code>status</code> (a dense telemetry bar where each child is a cell, where you can add <code>signal</code> for the accent tone), or <code>columns</code> (an auto-fit sitemap; a <code>.bottom</code> child spans full width).',
      play: {
        resize: true,
        state: {shape: '', glow: false, base: false},
        controls: [
          {
            type: 'select',
            key: 'shape',
            label: 'Shape',
            options: [
              {label: 'Strip', value: ''},
              {label: 'Status bar', value: 'status'},
              {label: 'Columns', value: 'columns'},
            ],
          },
          {type: 'toggle', key: 'glow', label: 'Glow edge'},
          {type: 'toggle', key: 'base', label: 'Base surface'},
        ],
        render: function (s) {
          var mods = [s.shape, s.glow && 'glow', s.base && 'base'].filter(Boolean);
          var cls = mods.length ? ' class="' + mods.join(' ') + '"' : '';
          if (s.shape === 'status') {
            return (
              '<footer' +
              cls +
              '>\n' +
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
              '<footer' +
              cls +
              '>\n' +
              '  <section>\n    <h6>Framework</h6>\n    <nav><a>Install</a><a>Vue</a><a>Nuxt</a></nav>\n  </section>\n' +
              '  <section>\n    <h6>Components</h6>\n    <nav><a>Buttons</a><a>Panels</a><a>Forms</a></nav>\n  </section>\n' +
              '  <section>\n    <h6>Resources</h6>\n    <nav><a>GitHub</a><a>Changelog</a><a>License</a></nav>\n  </section>\n' +
              '  <div class="bottom"><small>© 2025 VantaUI · MIT</small></div>\n' +
              '</footer>'
            );
          }
          return (
            '<footer' +
            cls +
            '>\n' +
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
        'Patterns from bare semantics. The <strong>bottom tab bar</strong> below is <code>&lt;nav class="bottom"&gt;</code> where items are <code>&lt;a&gt;</code>/<code>&lt;button&gt;</code> with an <code>&lt;i&gt;</code> + label; mark the current one <code>active</code>. Add <code>fixed</code> to pin it to the viewport floor. A <strong>breadcrumb</strong> is any <code>&lt;nav&gt;</code> wrapping an <code>&lt;ol&gt;</code>, which is automatically detected using <code>:has()</code> with no classes or manual separators.',
      play: {
        state: {active: 0},
        controls: [],
        render: function (s) {
          var items = [
            ['space_dashboard', 'Ops'],
            ['folder', 'Files'],
            ['map', 'Map'],
            ['settings', 'Setup'],
          ];
          var active = Number(s.active);
          return (
            '<nav class="bottom">\n' +
            items
              .map(function (it, i) {
                return (
                  '  <a' +
                  (i === active ? ' class="active"' : '') +
                  '><i>' +
                  it[0] +
                  '</i>' +
                  it[1] +
                  '</a>'
                );
              })
              .join('\n') +
            '\n</nav>'
          );
        },
        postPaint: function (stage, state, repaint) {
          stage.querySelectorAll('nav.bottom > a, nav.bottom > button').forEach(function (item, i) {
            item.addEventListener('click', function () {
              state.active = i;
              repaint();
            });
          });
        },
      },
      examples: [
        {
          label: 'Breadcrumb: <nav><ol>…</ol></nav>',
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
        state: {side: 'left'},
        controls: [
          {
            type: 'select',
            key: 'side',
            label: 'Edge',
            options: [
              {label: 'Left', value: 'left'},
              {label: 'Right', value: 'right'},
            ],
          },
        ],
        render: function (s) {
          return (
            '<button onclick="this.nextElementSibling.showModal()">Open ' +
            s.side +
            ' drawer</button>\n\n' +
            '<dialog class="' +
            s.side +
            '">\n' +
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
        'A semantic <code>&lt;aside class="drawer"&gt;</code> (or <code>&lt;nav class="drawer"&gt;</code>) in an app frame is a wide, text-labelled sidebar that is <strong>persistent on desktop but transitions off-canvas on mobile</strong> without requiring media queries. Structure it like any drawer; add <code>right</code> to dock it trailing. A <code>&lt;button data-open="id"&gt;</code> toggles it (optional JS). <em>This page&rsquo;s own sidebar is one.</em>',
      examples: [
        {
          frame: true,
          resize: true,
          code: '<aside class="drawer" id="demoDrawer">\n  <header>\n    <span><img src="assets/emblem.svg" alt="">VANTA<b>UI</b></span>\n    <button class="icon vui-until-m" data-close aria-label="Close"><i>close</i></button>\n  </header>\n  <nav>\n    <h6>Telemetry</h6>\n    <a class="active"><i>space_dashboard</i>Overview</a>\n    <a><i>radar</i>Scan</a>\n    <a><i>map</i>City Map</a>\n    <h6>System</h6>\n    <a><i>handyman</i>Loadout</a>\n    <a><i>settings</i>Setup</a>\n  </nav>\n  <footer>\n    <button class="ghost block"><i>home</i>Sign out</button>\n  </footer>\n</aside>',
          demo: '<div class="vui" style="block-size:600px">\n  <aside class="drawer" id="demoDrawer">\n    <header>\n      <span><img src="assets/emblem.svg" alt="">VANTA<b>UI</b></span>\n      <button class="icon vui-until-m" data-close aria-label="Close"><i>close</i></button>\n    </header>\n    <nav>\n      <h6>Telemetry</h6>\n      <a class="active"><i>space_dashboard</i>Overview</a>\n      <a><i>radar</i>Scan</a>\n      <a><i>map</i>City Map</a>\n      <h6>System</h6>\n      <a><i>handyman</i>Loadout</a>\n      <a><i>settings</i>Setup</a>\n    </nav>\n    <footer>\n      <button class="ghost block"><i>home</i>Sign out</button>\n    </footer>\n  </aside>\n  <header>\n    <button class="icon vui-until-m" data-open="demoDrawer" aria-label="Open menu"><i>menu</i></button>\n    <a>WAYNE<b>TECH</b></a>\n    <menu><button aria-label="Profile"><i>account_circle</i></button></menu>\n  </header>\n  <main>\n    <div class="vui-container">\n      <h1>Command Center</h1>\n      <p>The sidebar is pinned on desktop and collapses to an off-canvas drawer on phones (resize to see it switch).</p>\n    </div>\n  </main>\n</div>',
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
          resize: true,
          code: '<div class="vui-grid">\n  <article class="vui-s12 vui-m6 vui-l4">A</article>\n  <article class="vui-s12 vui-m6 vui-l4">B</article>\n  <article class="vui-s12 vui-m12 vui-l4">C</article>\n</div>',
        },
      ],
    },
    {
      group: 'Layout',
      id: 'autogrid',
      title: 'Auto grid',
      blurb:
        '<code>vui-autogrid</code> is the responsive-by-default card flow: it fits as many cards as the space allows at your <code>--vui-min</code> width, and reflows to a single full-width card on a phone without using breakpoints. Add <code>--fit</code> so a short last row stretches to fill.',
      play: {
        resize: true,
        state: {min: 13, fit: false},
        controls: [
          {type: 'range', key: 'min', label: 'Min card', min: 7, max: 22, suffix: 'rem'},
          {type: 'toggle', key: 'fit', label: 'Stretch last row (--fit)'},
        ],
        render: function (s) {
          var cls = 'vui-autogrid' + (s.fit ? ' vui-autogrid--fit' : '');
          return (
            '<div class="' +
            cls +
            '" style="--vui-min:' +
            s.min +
            'rem">\n' +
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
          resize: true,
          code: '<article class="vui-prose">\n  <h1>Knightfall Protocol</h1>\n  <p class="vui-eyebrow">Security Level: Classified</p>\n  <p>To preserve the security of Gotham City, the Knightfall Protocol has been established as a final contingency. In the event of primary identity compromise, all core assets are to be decommissioned.</p>\n\n  <blockquote>"The city needs a legend. Something worse than me."</blockquote>\n\n  <figure class="bleed">\n    <img src="preview.png" alt="Tactical HUD preview" style="aspect-ratio:16/9;object-fit:cover">\n    <figcaption>Fig. 01: VantaUI Tactical HUD telemetry.</figcaption>\n  </figure>\n\n  <p>All field agents are instructed to stand down. All communication links will be terminated.</p>\n</article>',
        },
      ],
    },
    {
      group: 'Layout',
      id: 'overflow',
      title: 'Overflow',
      blurb:
        'An app shell must never scroll sideways, so VantaUI contains overflow at the source. The stage carries <code>min-inline-size: 0</code> so that a wide child cannot balloon the grid and pull the chrome with it. Text wraps long strings (<code>overflow-wrap</code>), while <code>&lt;pre&gt;</code>, tables, and carousels scroll themselves. Tables also use <code>table-layout: fixed</code>, making them mathematically incapable of overflowing. Below <code>20rem</code> every word breaks, ensuring even a long heading stays in bounds. As a result, if you respect the semantics and use a few helpers, the layout will never overflow. If a mistake does occur, the stage scrolls instead of clipping, keeping the layout slip visible to you and the content reachable for your user.',
      examples: [
        {
          label: 'Long unbroken strings wrap without pushing the layout',
          code: '<article>\n  <p class="vui-eyebrow">Decryption key</p>\n  <p>VANTA0x4f2a9c1b2e8d3f6a509c1b2e8d3f6a509c1b2e8d3f6a509c1b2e8d3f6a509c1b2e8d</p>\n</article>',
        },
        {
          label: 'A wide <pre> scrolls itself without needing a wrapper',
          code: '<pre>$ vanta deploy --sector 14-C --threat high --uplink secure --window 24h --format ndjson --verbose</pre>',
        },
        {
          label: 'Deliberate horizontal scroll using the `.scroll` escape hatch',
          code: '<div class="scroll">\n  <table class="nowrap">\n    <thead><tr><th>Sector</th><th>Status</th><th>Operator</th><th>Last ping</th><th data-num>Threat</th></tr></thead>\n    <tbody>\n      <tr><td>Bleake Island</td><td>Contested</td><td>B. Wayne</td><td>02:18:04 UTC</td><td data-num>64</td></tr>\n      <tr class="red"><td>Miagani</td><td>Hostile</td><td>J. Gordon</td><td>02:17:51 UTC</td><td data-num>86</td></tr>\n      <tr><td>Founders Island</td><td>Secure</td><td>R. Sionis</td><td>02:16:30 UTC</td><td data-num>38</td></tr>\n    </tbody>\n  </table>\n</div>',
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
        state: {style: '', tone: '', size: '', icon: '', block: false, disabled: false},
        controls: [
          {
            type: 'select',
            key: 'style',
            label: 'Style',
            options: [
              {label: 'Outline', value: ''},
              {label: 'Filled', value: 'fill'},
              {label: 'Ghost', value: 'ghost'},
            ],
          },
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Cyan', value: ''},
              {label: 'Amber', value: 'amber'},
              {label: 'Danger', value: 'danger'},
              {label: 'Secure', value: 'secure'},
            ],
          },
          {
            type: 'select',
            key: 'size',
            label: 'Size',
            options: [
              {label: 'Medium', value: ''},
              {label: 'Small', value: 'small'},
              {label: 'Large', value: 'large'},
            ],
          },
          {
            type: 'select',
            key: 'icon',
            label: 'Icon',
            options: [
              {label: 'None', value: ''},
              {label: 'Icon + text', value: 'with-text'},
              {label: 'Icon only', value: 'only'},
            ],
          },
          {type: 'toggle', key: 'block', label: 'Full width'},
          {type: 'toggle', key: 'disabled', label: 'Disabled'},
        ],
        render: function (s) {
          var isFill = s.style === 'fill';
          var c = [];
          if (s.style === 'ghost') c.push('ghost');
          if (s.tone) c.push(s.tone);
          if (s.size) c.push(s.size);
          if (s.icon === 'only') c.push('icon');
          else if (s.block) c.push('block');
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          var type = isFill && s.icon !== 'only' ? ' type="submit"' : '';
          var dis = s.disabled ? ' disabled' : '';
          if (s.icon === 'only')
            return '<button' + type + cls + dis + ' aria-label="Scan"><i>radar</i></button>';
          if (s.icon === 'with-text')
            return '<button' + type + cls + dis + '><i>radar</i>Authorize</button>';
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
        state: {
          surface: '',
          tint: '',
          intensity: '',
          glow: false,
          notch: false,
          brackets: false,
          sections: false,
        },
        controls: [
          {
            type: 'select',
            key: 'surface',
            label: 'Surface',
            options: [
              {label: 'Panel', value: ''},
              {label: 'Raised', value: 'raised'},
              {label: 'Inset', value: 'inset'},
              {label: 'Flat', value: 'flat'},
              {label: 'Stage', value: 'stage'},
            ],
          },
          {
            type: 'select',
            key: 'tint',
            label: 'Tint',
            options: [
              {label: 'None', value: ''},
              {label: 'Cyan', value: 'cyan'},
              {label: 'Amber', value: 'amber'},
              {label: 'Red', value: 'red'},
              {label: 'Green', value: 'green'},
            ],
          },
          {
            type: 'select',
            key: 'intensity',
            label: 'Intensity',
            options: [
              {label: 'Default', value: ''},
              {label: 'Dim', value: 'dim'},
              {label: 'Vivid', value: 'vivid'},
            ],
          },
          {type: 'toggle', key: 'glow', label: 'Glow'},
          {type: 'toggle', key: 'notch', label: 'Notch'},
          {type: 'toggle', key: 'brackets', label: 'Brackets'},
          {type: 'toggle', key: 'sections', label: 'Header & footer'},
        ],
        render: function (s) {
          var c = [
            s.surface,
            s.tint,
            s.intensity,
            s.glow && 'glow',
            s.notch && 'notch',
            s.brackets && 'brackets',
          ].filter(Boolean);
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          if (s.sections) {
            return (
              '<article' +
              cls +
              '>\n' +
              '  <header>\n    <small class="vui-eyebrow">Case File</small>\n    <small>14-C</small>\n  </header>\n' +
              '  <p>Recovered intel from the broker drop. Chain of custody verified.</p>\n' +
              '  <footer><button class="small">Open</button></footer>\n' +
              '</article>'
            );
          }
          return (
            '<article' +
            cls +
            '>\n  <p>Recovered intel from the broker drop. Chain of custody verified.</p>\n</article>'
          );
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
        state: {tone: 'cyan', dot: false, solid: false},
        controls: [
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Cyan', value: 'cyan'},
              {label: 'Amber', value: 'amber'},
              {label: 'Red', value: 'red'},
              {label: 'Green', value: 'green'},
              {label: 'Neutral', value: 'neutral'},
            ],
          },
          {type: 'toggle', key: 'dot', label: 'Live dot'},
          {type: 'toggle', key: 'solid', label: 'Solid fill'},
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
        'Native controls are styled directly with no wrappers. A <code>&lt;label&gt;</code> wrapping a field stacks it (leading <code>&lt;span&gt;</code> label, trailing <code>&lt;small&gt;</code> hint; add <code>error</code> to the hint when <code>aria-invalid</code>). The single field below is live; switches, checkboxes, radios and the range slider follow.',
      play: {
        state: {type: 'password', invalid: false, disabled: false, hint: true},
        controls: [
          {
            type: 'select',
            key: 'type',
            label: 'Field',
            options: [
              {label: 'Text', value: 'text'},
              {label: 'Password', value: 'password'},
              {label: 'Select', value: 'select'},
              {label: 'Textarea', value: 'textarea'},
            ],
          },
          {type: 'toggle', key: 'invalid', label: 'Invalid'},
          {type: 'toggle', key: 'disabled', label: 'Disabled'},
          {type: 'toggle', key: 'hint', label: 'Hint'},
        ],
        render: function (s) {
          var inv = s.invalid ? ' aria-invalid="true"' : '';
          var dis = s.disabled ? ' disabled' : '';
          var control;
          if (s.type === 'select') {
            control =
              '<select' +
              inv +
              dis +
              ">\n    <option>Bleake Island</option>\n    <option>Miagani</option>\n    <option>Founders'</option>\n  </select>";
          } else if (s.type === 'textarea') {
            control = '<textarea placeholder="Field report…"' + inv + dis + '></textarea>';
          } else {
            var val = s.type === 'password' ? 'wayne' : 'b.wayne';
            control =
              '<input type="' +
              s.type +
              '" placeholder="••••••••" value="' +
              val +
              '"' +
              inv +
              dis +
              '>';
          }
          var hint = s.hint
            ? '\n  <small' +
              (s.invalid ? ' class="error"' : '') +
              '>' +
              (s.invalid ? 'Access denied: code rejected.' : '8–32 characters.') +
              '</small>'
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
        resize: true,
        state: {role: 'status', tone: '', title: true},
        controls: [
          {
            type: 'select',
            key: 'role',
            label: 'Role',
            options: [
              {label: 'status', value: 'status'},
              {label: 'alert', value: 'alert'},
            ],
          },
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Default', value: ''},
              {label: 'Info', value: 'info'},
              {label: 'Warn', value: 'warn'},
              {label: 'Threat', value: 'threat'},
              {label: 'Secure', value: 'secure'},
            ],
          },
          {type: 'toggle', key: 'title', label: 'Title'},
        ],
        render: function (s) {
          var cls = s.tone ? ' class="' + s.tone + '"' : '';
          var title = s.title ? '\n  <strong>Uplink status</strong>' : '';
          var body =
            s.role === 'alert'
              ? '\n  12 contacts · grid 14-C · ETA 2m\n'
              : '\n  Channel encrypted end-to-end.\n';
          return '<div role="' + s.role + '"' + cls + '>' + title + body + '</div>';
        },
      },
    },
    {
      group: 'Components',
      id: 'meters',
      title: 'Meters & progress',
      blurb:
        'The <code>.meter</code> helper is a labelled, accent-toned bar driven purely by <code>--value</code> where the readout renders from a CSS counter without JavaScript. Tone it, or add <code>segmented</code> for ticks. Native <code>&lt;meter&gt;</code> (threshold-coloured) and <code>&lt;progress&gt;</code> are restyled too; add <code>data-animate</code> (with the JS helper) to count up on view.',
      play: {
        state: {tone: '', segmented: false, value: 73},
        controls: [
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Cyan', value: ''},
              {label: 'Amber', value: 'amber'},
              {label: 'Red', value: 'red'},
              {label: 'Green', value: 'green'},
            ],
          },
          {type: 'toggle', key: 'segmented', label: 'Segmented'},
          {type: 'range', key: 'value', label: 'Value', min: 0, max: 100},
        ],
        render: function (s) {
          var c = ['meter', s.tone, s.segmented && 'segmented'].filter(Boolean);
          return (
            '<div class="' +
            c.join(' ') +
            '" style="--value:' +
            s.value +
            '">\n  <span>Suit Integrity</span>\n  <b></b>\n</div>'
          );
        },
      },
      examples: [
        {
          code: '<meter min="0" max="100" low="30" high="70" optimum="100" value="86"></meter>\n<progress max="100" value="62"></progress>',
        },
        {
          label: 'Counts up on view via data-animate (optional JS)',
          code: '<div class="meter amber" data-value="62" data-animate style="--value:0">\n  <span>Threat Level</span>\n  <b></b>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'gauge',
      title: 'Radial gauge',
      blurb:
        'A 270° arc readout built from a single conic-gradient with no SVG and no JavaScript. The value renders from <code>--value</code>; leave <code>&lt;b&gt;</code> empty and a counter fills it. Fluid by default — it scales with the viewport; set <code>--size</code> for a fixed footprint. Tone with a colour word.',
      play: {
        state: {tone: '', value: 87, size: 8},
        controls: [
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Cyan', value: ''},
              {label: 'Amber', value: 'amber'},
              {label: 'Red', value: 'red'},
              {label: 'Green', value: 'green'},
            ],
          },
          {type: 'range', key: 'value', label: 'Value', min: 0, max: 100},
          {type: 'range', key: 'size', label: 'Size (--size)', min: 6, max: 11, suffix: 'rem'},
        ],
        render: function (s) {
          var c = ['gauge', s.tone].filter(Boolean);
          return (
            '<div class="' +
            c.join(' ') +
            '" style="--value:' +
            s.value +
            '; --size:' +
            s.size +
            'rem">\n  <b></b><small>%</small>\n  <span>Integrity</span>\n</div>'
          );
        },
      },
    },
    {
      group: 'Components',
      id: 'tabs',
      title: 'Tabs',
      blurb:
        'Semantic <code>nav[role=tablist]</code> + <code>button[role=tab]</code>. The optional JS wires clicks, arrow keys, and panel visibility via <code>aria-controls</code>. A trailing <code>&lt;small&gt;</code> is a count chip. (Clicking a tab here is the live JS at work.)',
      play: {
        resize: true,
        state: {active: 0, count: true},
        controls: [
          {
            type: 'select',
            key: 'active',
            label: 'Default tab',
            options: [
              {label: 'Case Files', value: 0},
              {label: 'City Map', value: 1},
              {label: 'Loadout', value: 2},
            ],
          },
          {type: 'toggle', key: 'count', label: 'Count chip'},
        ],
        render: function (s) {
          var active = Number(s.active);
          var tabs = [
            ['t-cases', 'Case Files', '7', 'Seven open cases in the active sweep.'],
            ['t-map', 'City Map', '', 'City map module offline.'],
            ['t-gear', 'Loadout', '', 'Three gadgets equipped.'],
          ];
          var strip = tabs
            .map(function (t, i) {
              var chip = s.count && t[2] ? ' <small>' + t[2] + '</small>' : '';
              return (
                '  <button role="tab" aria-controls="' + t[0] + '"' +
                (i === active ? ' aria-selected="true"' : '') +
                '>' + t[1] + chip + '</button>'
              );
            })
            .join('\n');
          var panels = tabs
            .map(function (t, i) {
              return (
                '<div role="tabpanel" id="' + t[0] + '"' +
                (i === active ? '' : ' hidden') +
                '>' + t[3] + '</div>'
              );
            })
            .join('\n');
          return '<nav role="tablist">\n' + strip + '\n</nav>\n' + panels;
        },
      },
    },
    {
      group: 'Components',
      id: 'disclosure',
      title: 'Accordion',
      blurb:
        'Native <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> styled as a chamfered, zero-JS disclosure that animates open on browsers supporting <code>::details-content</code>. Add <code>name</code> to make a group behave as an exclusive accordion (one open at a time).',
      play: {
        state: {open: true, exclusive: false},
        controls: [
          {type: 'toggle', key: 'open', label: 'First open'},
          {type: 'toggle', key: 'exclusive', label: 'Exclusive (shared name)'},
        ],
        render: function (s) {
          var name = s.exclusive ? ' name="brief"' : '';
          var open = s.open ? ' open' : '';
          return (
            '<details' + name + open + '>\n' +
            '  <summary>Mission briefing</summary>\n' +
            '  Intercept the broker at pier 14-C before the data drive changes hands.\n' +
            '</details>\n' +
            '<details' + name + '>\n' +
            '  <summary>Known associates</summary>\n' +
            '  Ironhand · The Chemist · Night Courier.\n' +
            '</details>'
          );
        },
      },
    },
    {
      group: 'Components',
      id: 'table',
      title: 'Tables',
      blurb:
        'A semantic <code>&lt;table&gt;</code> becomes a telemetry grid: uppercase eyebrow headers, hairline rows, cyan hover. Mark numeric cells with <code>data-num</code>; tint a row with a colour word. Cells <strong>wrap by default</strong> and columns are fixed-width, so a bare table never overflows. Add <code>nowrap</code> to keep cells on one line, which you can then wrap in <code>.scroll</code> to scroll instead of stretch.',
      play: {
        resize: true,
        state: {
          density: '',
          striped: false,
          ruled: false,
          opaque: false,
          flat: false,
          nowrap: false,
        },
        controls: [
          {
            type: 'select',
            key: 'density',
            label: 'Density',
            options: [
              {label: 'Default', value: ''},
              {label: 'Compact', value: 'compact'},
              {label: 'Relaxed', value: 'relaxed'},
            ],
          },
          {type: 'toggle', key: 'striped', label: 'Striped'},
          {type: 'toggle', key: 'ruled', label: 'Column rules'},
          {type: 'toggle', key: 'opaque', label: 'Opaque'},
          {type: 'toggle', key: 'flat', label: 'No hover'},
          {type: 'toggle', key: 'nowrap', label: 'Nowrap + scroll'},
        ],
        render: function (s) {
          var c = [
            s.density,
            s.striped && 'striped',
            s.ruled && 'ruled',
            s.opaque && 'opaque',
            s.flat && 'flat',
            s.nowrap && 'nowrap',
          ].filter(Boolean);
          var cls = c.length ? ' class="' + c.join(' ') + '"' : '';
          var table =
            '<table' +
            cls +
            '>\n' +
            '  <caption>District status</caption>\n' +
            '  <thead><tr><th>Sector</th><th>Status</th><th data-num>Threat</th></tr></thead>\n' +
            '  <tbody>\n' +
            '    <tr><td>Bleake Island</td><td>Contested</td><td data-num>64</td></tr>\n' +
            '    <tr><td>Miagani</td><td>Hostile</td><td data-num>86</td></tr>\n' +
            '    <tr class="red"><td>Coventry</td><td>Critical</td><td data-num>92</td></tr>\n' +
            "    <tr><td>Founders'</td><td>Secure</td><td data-num>38</td></tr>\n" +
            '  </tbody>\n' +
            '</table>';
          // .nowrap reverts to content-driven width, so a wide one needs .scroll
          // to scroll; the default wrapping table is self-contained, no wrapper.
          return s.nowrap ? '<div class="scroll">\n' + table + '\n</div>' : table;
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

    /* ---------------- FEEDBACK ---------------- */
    {
      group: 'Feedback',
      id: 'spinner',
      title: 'Spinner',
      blurb:
        'The indeterminate companion to meters and gauges: a radar-style sweep for <code>working…</code> states. On a <code>&lt;span&gt;</code>; size with <code>small</code>·<code>large</code>, tone with a colour word, add a trailing label, or <code>block</code> to centre it. Give it <code>role="status"</code> for assistive tech.',
      play: {
        state: {tone: '', size: '', label: false, block: false},
        controls: [
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Cyan', value: ''},
              {label: 'Amber', value: 'amber'},
              {label: 'Red', value: 'red'},
              {label: 'Green', value: 'green'},
            ],
          },
          {
            type: 'select',
            key: 'size',
            label: 'Size',
            options: [
              {label: 'Medium', value: ''},
              {label: 'Small', value: 'small'},
              {label: 'Large', value: 'large'},
            ],
          },
          {type: 'toggle', key: 'label', label: 'Inline label'},
          {type: 'toggle', key: 'block', label: 'Block (centered)'},
        ],
        render: function (s) {
          var c = ['spinner', s.tone, s.size, s.block && 'block'].filter(Boolean);
          var label = s.label ? 'Scanning sector…' : '';
          return (
            '<span class="' + c.join(' ') + '" role="status" aria-label="Loading">' + label + '</span>'
          );
        },
      },
    },
    {
      group: 'Feedback',
      id: 'skeleton',
      title: 'Skeleton',
      blurb:
        'Dim, faintly-scanning placeholders for content that has not loaded. <code>.skeleton</code> is a block; <code>.text</code> a line (add <code>.last</code> for a short tail), <code>.circle</code> an avatar disc. Mark the group <code>aria-hidden="true"</code>.',
      play: {
        state: {shape: 'text', last: false},
        controls: [
          {
            type: 'select',
            key: 'shape',
            label: 'Shape',
            options: [
              {label: 'Text line', value: 'text'},
              {label: 'Block', value: 'block'},
              {label: 'Circle', value: 'circle'},
            ],
          },
          {type: 'toggle', key: 'last', label: 'Short last line (text only)'},
        ],
        render: function (s) {
          var c = ['skeleton', s.shape, s.shape === 'text' && s.last && 'last'].filter(Boolean);
          /* skeletons fill their container, so size the group, not the element */
          return (
            '<div aria-hidden="true" style="inline-size:320px">\n' +
            '  <div class="' + c.join(' ') + '"></div>\n' +
            '</div>'
          );
        },
      },
      examples: [
        {
          label: 'Composite: a loading card',
          code: '<article style="inline-size:300px" aria-hidden="true">\n  <div class="vui-row" style="gap:12px;align-items:center">\n    <span class="skeleton circle"></span>\n    <div style="flex:1">\n      <span class="skeleton text"></span>\n      <span class="skeleton text last" style="margin-block-start:8px"></span>\n    </div>\n  </div>\n  <div class="skeleton block" style="margin-block-start:14px"></div>\n</article>',
        },
      ],
    },
    {
      group: 'Feedback',
      id: 'empty',
      title: 'Empty state',
      blurb:
        'A centred placeholder for <em>no data</em> regions, composed from bare elements: a leading <code>&lt;i&gt;</code> glyph, a heading, a <code>&lt;p&gt;</code>, and an optional trailing <code>&lt;menu&gt;</code> of actions.',
      play: {
        state: {glyph: true, actions: true},
        controls: [
          {type: 'toggle', key: 'glyph', label: 'Leading glyph'},
          {type: 'toggle', key: 'actions', label: 'Action buttons'},
        ],
        render: function (s) {
          var glyph = s.glyph ? '\n  <i>satellite_alt</i>' : '';
          var actions = s.actions
            ? '\n  <menu>\n    <button type="submit">Rescan</button>\n    <button class="ghost">Filters</button>\n  </menu>'
            : '';
          return (
            '<div class="empty">' +
            glyph +
            '\n  <h3>No contacts</h3>\n  <p>No active signals in this sector. Widen the scan radius or check back after the next sweep.</p>' +
            actions +
            '\n</div>'
          );
        },
      },
    },

    /* ---------------- DATA DISPLAY ---------------- */
    {
      group: 'Data display',
      id: 'avatar',
      title: 'Avatar',
      blurb:
        'Operator identity on a <code>&lt;span&gt;</code> (initials) or <code>&lt;img&gt;</code>. Chamfered by default; <code>round</code> or <code>hex</code> to reshape, <code>small</code>·<code>large</code> to size. A status word (<code>online</code>·<code>busy</code>·<code>idle</code>·<code>offline</code>) lights a glowing frame; <code>.avatar-group</code> overlaps a stack.',
      play: {
        state: {shape: '', size: '', status: '', group: false},
        controls: [
          {
            type: 'select',
            key: 'shape',
            label: 'Shape',
            options: [
              {label: 'Plate', value: ''},
              {label: 'Round', value: 'round'},
              {label: 'Hex', value: 'hex'},
            ],
          },
          {
            type: 'select',
            key: 'size',
            label: 'Size',
            options: [
              {label: 'Medium', value: ''},
              {label: 'Small', value: 'small'},
              {label: 'Large', value: 'large'},
            ],
          },
          {
            type: 'select',
            key: 'status',
            label: 'Status',
            options: [
              {label: 'None', value: ''},
              {label: 'Online', value: 'online'},
              {label: 'Busy', value: 'busy'},
              {label: 'Idle', value: 'idle'},
              {label: 'Offline', value: 'offline'},
            ],
          },
          {type: 'toggle', key: 'group', label: 'Overlapping group'},
        ],
        render: function (s) {
          if (s.group) {
            var g = ['avatar', s.shape, s.size].filter(Boolean).join(' ');
            return (
              '<div class="avatar-group">\n' +
              '  <span class="' + g + '">A1</span>\n' +
              '  <span class="' + g + '">B2</span>\n' +
              '  <span class="' + g + '">C3</span>\n' +
              '  <span class="' + g + '">+5</span>\n' +
              '</div>'
            );
          }
          var c = ['avatar', s.shape, s.size, s.status].filter(Boolean);
          return '<span class="' + c.join(' ') + '">BW</span>';
        },
      },
    },
    {
      group: 'Data display',
      id: 'dl',
      title: 'Description list',
      blurb:
        'A bare <code>&lt;dl&gt;</code> is a telemetry readout where each <code>&lt;dt&gt;</code> is an uppercase label and each <code>&lt;dd&gt;</code> is a monospaced value, separated by hairlines. Add <code>stacked</code> for label-over-value rows.',
      play: {
        state: {stacked: false},
        controls: [{type: 'toggle', key: 'stacked', label: 'Stacked (label over value)'}],
        render: function (s) {
          var cls = s.stacked ? ' class="stacked"' : '';
          return (
            '<dl' + cls + '>\n' +
            '  <dt>Operator</dt>\n  <dd>B. Wayne</dd>\n' +
            '  <dt>Clearance</dt>\n  <dd>OMEGA-7</dd>\n' +
            '  <dt>Sector</dt>\n  <dd>14-C</dd>\n' +
            '  <dt>Status</dt>\n  <dd>Active</dd>\n' +
            '</dl>'
          );
        },
      },
    },
    {
      group: 'Data display',
      id: 'timeline',
      title: 'Timeline / log',
      blurb:
        'An <code>&lt;ol class="timeline"&gt;</code> is a vertical event feed: each <code>&lt;li&gt;</code> gets a glowing node on a rail. Lead with a <code>&lt;time&gt;</code> stamp; tone a node with a colour word on the <code>&lt;li&gt;</code>. Add <code>log</code> for a dense monospaced feed.',
      play: {
        state: {log: false},
        controls: [{type: 'toggle', key: 'log', label: 'Dense feed (.log)'}],
        render: function (s) {
          var cls = s.log ? 'timeline log' : 'timeline';
          var rows = s.log
            ? '  <li class="green"><time>02:14:06</time>› handshake OK</li>\n' +
              '  <li><time>02:15:22</time>› drone.deploy(grid-22A)</li>\n' +
              '  <li class="amber"><time>02:16:40</time>› WARN motion 22-A</li>\n' +
              '  <li class="red"><time>02:18:03</time>› ERR uplink_timeout</li>\n'
            : '  <li class="green"><time>02:14:06</time>Uplink established · sector 14-C</li>\n' +
              '  <li><time>02:15:22</time>Patrol drone deployed</li>\n' +
              '  <li class="amber"><time>02:16:40</time>Motion flagged: grid 22-A</li>\n' +
              '  <li class="red"><time>02:18:03</time>Contact lost · rerouting</li>\n';
          return '<ol class="' + cls + '">\n' + rows + '</ol>';
        },
      },
    },
    {
      group: 'Data display',
      id: 'rating',
      title: 'Rating / signal',
      blurb:
        'A <code>&lt;fieldset class="rating"&gt;</code> of radios reads as signal-strength / threat pips that you click or arrow-key to set, filling up to the selected choice. Real radios, so it keyboards and posts like a radiogroup. Author them <strong>low → high</strong>; tone with a colour word and add <code>readonly</code> for a static readout.',
      play: {
        state: {tone: 'amber', value: 3, readonly: false},
        controls: [
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Cyan', value: ''},
              {label: 'Amber', value: 'amber'},
              {label: 'Red', value: 'red'},
              {label: 'Green', value: 'green'},
            ],
          },
          {type: 'range', key: 'value', label: 'Level', min: 1, max: 5},
          {type: 'toggle', key: 'readonly', label: 'Read-only'},
        ],
        render: function (s) {
          var c = ['rating', s.tone, s.readonly && 'readonly'].filter(Boolean);
          var pips = '';
          for (var i = 1; i <= 5; i++) {
            pips +=
              '\n  <label for="th' + i + '"><i>warning</i></label>' +
              '<input type="radio" name="threat" id="th' + i + '" value="' + i + '"' +
              (i === Number(s.value) ? ' checked' : '') +
              (s.readonly ? ' disabled' : '') +
              '>';
          }
          return '<fieldset class="' + c.join(' ') + '">\n  <legend>Threat level</legend>' + pips + '\n</fieldset>';
        },
      },
    },

    /* ---------------- CONTROLS ---------------- */
    {
      group: 'Controls',
      id: 'segmented',
      title: 'Segmented control',
      blurb:
        'A single-select switch built from real radios: it requires no JavaScript and keyboards like a radiogroup. Each <code>&lt;label&gt;</code> wraps an <code>&lt;input type="radio"&gt;</code> (+ optional <code>&lt;i&gt;</code>); the checked segment lights up. Tone with a colour word, size with <code>small</code>.',
      play: {
        state: {tone: '', small: false, active: 0},
        controls: [
          {
            type: 'select',
            key: 'tone',
            label: 'Tone',
            options: [
              {label: 'Cyan', value: ''},
              {label: 'Amber', value: 'amber'},
              {label: 'Red', value: 'red'},
              {label: 'Green', value: 'green'},
            ],
          },
          {
            type: 'select',
            key: 'active',
            label: 'Selected',
            options: [
              {label: 'Grid', value: 0},
              {label: 'List', value: 1},
              {label: 'Map', value: 2},
            ],
          },
          {type: 'toggle', key: 'small', label: 'Small'},
        ],
        render: function (s) {
          var c = ['segmented', s.tone, s.small && 'small'].filter(Boolean);
          var items = [
            ['grid_view', 'Grid'],
            ['view_list', 'List'],
            ['map', 'Map'],
          ];
          var labels = items
            .map(function (it, i) {
              return (
                '  <label><input type="radio" name="view"' +
                (i === Number(s.active) ? ' checked' : '') +
                '><i>' + it[0] + '</i>' + it[1] + '</label>'
              );
            })
            .join('\n');
          return (
            '<div class="' + c.join(' ') + '" role="radiogroup" aria-label="View mode">\n' +
            labels +
            '\n</div>'
          );
        },
      },
    },
    {
      group: 'Controls',
      id: 'pagination',
      title: 'Pagination',
      blurb:
        'A <code>&lt;nav class="pagination"&gt;</code> wrapping a list of page links. Mark the current page <code>aria-current="page"</code>; a lone <code>&lt;i&gt;</code> is an icon prev/next, a bare <code>&lt;span&gt;</code> an ellipsis. Add <code>compact</code> for table footers.',
      play: {
        state: {page: 1, compact: false},
        controls: [
          {
            type: 'select',
            key: 'page',
            label: 'Current page',
            options: [
              {label: '1', value: 1},
              {label: '2', value: 2},
              {label: '3', value: 3},
            ],
          },
          {type: 'toggle', key: 'compact', label: 'Compact'},
        ],
        render: function (s) {
          var cls = s.compact ? 'pagination compact' : 'pagination';
          var page = Number(s.page);
          var prevDis = page === 1 ? ' aria-disabled="true"' : '';
          var items = [1, 2, 3]
            .map(function (n) {
              return (
                '    <li><a' +
                (n === page ? ' aria-current="page"' : '') +
                '>' + n + '</a></li>'
              );
            })
            .join('\n');
          return (
            '<nav class="' + cls + '" aria-label="Pagination">\n' +
            '  <a aria-label="Previous page"' + prevDis + '><i>chevron_left</i></a>\n' +
            '  <ul>\n' +
            items +
            '\n    <li><span>…</span></li>\n    <li><a>12</a></li>\n' +
            '  </ul>\n' +
            '  <a aria-label="Next page"><i>chevron_right</i></a>\n' +
            '</nav>'
          );
        },
      },
    },
    {
      group: 'Controls',
      id: 'stepper',
      title: 'Stepper',
      blurb:
        'An <code>&lt;ol class="stepper"&gt;</code> of numbered steps joined by a connector. Mark the active step <code>aria-current="step"</code> and cleared steps <code>done</code> (a check replaces the number). Add <code>vertical</code> to stack.',
      play: {
        state: {active: 2, vertical: false},
        controls: [
          {
            type: 'select',
            key: 'active',
            label: 'Active step',
            options: [
              {label: 'Recon', value: 0},
              {label: 'Breach', value: 1},
              {label: 'Secure', value: 2},
              {label: 'Extract', value: 3},
            ],
          },
          {type: 'toggle', key: 'vertical', label: 'Vertical'},
        ],
        render: function (s) {
          var cls = s.vertical ? 'stepper vertical' : 'stepper';
          var active = Number(s.active);
          var steps = ['Recon', 'Breach', 'Secure', 'Extract'];
          var lis = steps
            .map(function (label, i) {
              var a = i < active ? ' class="done"' : i === active ? ' aria-current="step"' : '';
              return '  <li' + a + '>' + label + '</li>';
            })
            .join('\n');
          return '<ol class="' + cls + '">\n' + lis + '\n</ol>';
        },
      },
    },

    /* ---------------- INTERACTIVE ---------------- */
    {
      group: 'Interactive',
      id: 'dropdown',
      title: 'Dropdown menu',
      blurb:
        'Two ways in, one look. The robust path is <code>&lt;details class="dropdown"&gt;</code>, which requires no JavaScript and works everywhere; the <code>&lt;summary&gt;</code> is the trigger and the panel is a <code>&lt;menu&gt;</code>. The optional JS adds outside-click / <kbd>Esc</kbd> dismissal. For the modern top-layer path, point a <code>&lt;button popovertarget&gt;</code> at a <code>[popover].menu</code> (anchor-positioned where supported). Items are <code>&lt;a&gt;</code>/<code>&lt;button&gt;</code>; <code>&lt;hr&gt;</code> divides, an <code>&lt;h6&gt;</code> is a group heading, <code>.danger</code> tones an item, and <code>.right</code> aligns the panel to the trailing edge.',
      play: {
        state: {right: false, heading: true, danger: true},
        controls: [
          {type: 'toggle', key: 'heading', label: 'Group heading'},
          {type: 'toggle', key: 'danger', label: 'Danger item'},
          {type: 'toggle', key: 'right', label: 'Align right'},
        ],
        render: function (s) {
          var cls = s.right ? 'dropdown right' : 'dropdown';
          var heading = s.heading ? '\n    <h6>Unit</h6>' : '';
          var danger = s.danger
            ? '\n    <hr>\n    <button class="danger"><i>delete</i>Decommission</button>'
            : '';
          return (
            '<details class="' + cls + '">\n' +
            '  <summary>Actions <i>expand_more</i></summary>\n' +
            '  <menu>' +
            heading +
            '\n    <a href="#"><i>visibility</i>Inspect</a>\n' +
            '    <a href="#"><i>content_copy</i>Duplicate</a>\n' +
            '    <a href="#"><i>download</i>Export intel</a>' +
            danger +
            '\n  </menu>\n' +
            '</details>'
          );
        },
      },
    },
    {
      group: 'Interactive',
      id: 'toolbar',
      title: 'Toolbar',
      blurb:
        'A <code>&lt;div role="toolbar"&gt;</code> is a control surface holding buttons, button groups (<code>&lt;menu class="group"&gt;</code>), an <code>&lt;hr&gt;</code> separator and a <code>.max</code> spacer. The optional JS gives it the roving-tabindex model: one tab stop where arrow keys move between controls. Add <code>vertical</code> to stand it on end (up/down arrows).',
      play: {
        state: {vertical: false},
        controls: [{type: 'toggle', key: 'vertical', label: 'Vertical'}],
        render: function (s) {
          var attr = s.vertical ? ' class="vertical"' : '';
          return (
            '<div role="toolbar"' + attr + ' aria-label="Map tools">\n' +
            '  <button class="icon" aria-label="Pan"><i>pan_tool</i></button>\n' +
            '  <button class="icon" aria-label="Measure"><i>straighten</i></button>\n' +
            '  <button class="icon" aria-label="Mark"><i>add_location</i></button>\n' +
            '  <hr>\n' +
            '  <menu class="group">\n' +
            '    <button class="small">Sat</button>\n' +
            '    <button class="small">Thermal</button>\n' +
            '    <button class="small">Night</button>\n' +
            '  </menu>\n' +
            '  <span class="max"></span>\n' +
            '  <button class="icon" aria-label="Settings"><i>tune</i></button>\n' +
            '</div>'
          );
        },
      },
    },
    {
      group: 'Interactive',
      id: 'tree',
      title: 'Tree',
      blurb:
        'A <code>&lt;ul class="tree"&gt;</code> is a hierarchy. A branch is a <code>&lt;li&gt;&lt;details&gt;&lt;summary&gt;…&lt;/summary&gt;&lt;ul&gt;…&lt;/ul&gt;&lt;/details&gt;</code> that collapses with zero JS and animates open where supported. A leaf is a plain <code>&lt;li&gt;&lt;a&gt;</code>; lead any row with an <code>&lt;i&gt;</code> and mark the selected leaf <code>aria-current="page"</code>. Guide rails connect each level. (Toggle the folders to expand/collapse.)',
      play: {
        state: {selected: 'case-002.dat'},
        controls: [
          {
            type: 'select',
            key: 'selected',
            label: 'Selected leaf',
            options: [
              {label: 'case-001.dat', value: 'case-001.dat'},
              {label: 'case-002.dat', value: 'case-002.dat'},
              {label: 'sealed-07.dat', value: 'sealed-07.dat'},
              {label: 'city-grid.geo', value: 'city-grid.geo'},
            ],
          },
        ],
        render: function (s) {
          function leaf(icon, name) {
            var cur = name === s.selected ? ' aria-current="page"' : '';
            return '<a href="#"' + cur + '><i>' + icon + '</i>' + name + '</a>';
          }
          var archiveOpen = s.selected === 'sealed-07.dat' ? ' open' : '';
          return (
            '<ul class="tree">\n' +
            '  <li>\n    <details open>\n      <summary><i>folder_open</i>Sector 14-C</summary>\n      <ul>\n' +
            '        <li>' + leaf('description', 'case-001.dat') + '</li>\n' +
            '        <li>' + leaf('description', 'case-002.dat') + '</li>\n' +
            '        <li>\n          <details' + archiveOpen + '>\n            <summary><i>folder</i>archive</summary>\n            <ul>\n' +
            '              <li>' + leaf('lock', 'sealed-07.dat') + '</li>\n' +
            '            </ul>\n          </details>\n        </li>\n' +
            '      </ul>\n    </details>\n  </li>\n' +
            '  <li>' + leaf('map', 'city-grid.geo') + '</li>\n' +
            '</ul>'
          );
        },
      },
      examples: [
        {
          label: 'Upgrade to a full ARIA tree widget',
          noDemo: true,
          code: '<!-- The disclosure tree is accessible as nested groups. For a true\n     tree WIDGET (single tab stop, arrow-key walk, type-ahead) layer on\n     the ARIA roles + aria-expanded, then drive focus in JS. -->\n<ul class="tree" role="tree" aria-label="Files">\n  <li role="treeitem" aria-expanded="true">\n    <details open>\n      <summary><i>folder_open</i>Sector 14-C</summary>\n      <ul role="group">\n        <li role="treeitem"><a href="#"><i>description</i>case-001.dat</a></li>\n      </ul>\n    </details>\n  </li>\n</ul>\n\n// roving tabindex: one stop, ArrowUp/Down move, ArrowRight/Left\n// expand/collapse. Reuse the pattern from VantaUI.toolbars().',
        },
      ],
    },
    {
      group: 'Interactive',
      id: 'carousel',
      title: 'Carousel',
      blurb:
        'A <code>&lt;div class="carousel"&gt;</code> is a horizontal scroll-snap filmstrip where the direct children are the slides. Swipe, scroll or keyboard by default; on browsers with CSS-carousel support it also grows native prev/next arrows + a row of snap-marker dots, no JS. Size slides with <code>--vui-slide</code>; <code>peek</code> reveals the next, <code>full</code> snaps one per view, <code>clean</code> hides the scrollbar, <code>no-arrows</code>/<code>no-dots</code> drop either control. Drag the preview narrower to see the dots stay centred on the track.',
      play: {
        resize: true,
        state: {mode: '', clean: false, arrows: true, dots: true},
        controls: [
          {
            type: 'select',
            key: 'mode',
            label: 'Slide fit',
            options: [
              {label: 'Default', value: ''},
              {label: 'Peek next', value: 'peek'},
              {label: 'Full (one per view)', value: 'full'},
            ],
          },
          {type: 'toggle', key: 'arrows', label: 'Prev / next arrows'},
          {type: 'toggle', key: 'dots', label: 'Marker dots'},
          {type: 'toggle', key: 'clean', label: 'Hide scrollbar (clean)'},
        ],
        render: function (s) {
          var cls = [
            'carousel',
            s.mode,
            s.clean ? 'clean' : '',
            s.arrows ? '' : 'no-arrows',
            s.dots ? '' : 'no-dots',
          ].filter(Boolean);
          return (
            '<div class="' +
            cls.join(' ') +
            '">\n' +
            '  <article><div class="stat signal"><b>14-C</b><span>Sector</span></div><p>Contested · 6 contacts</p></article>\n' +
            '  <article><div class="stat amber"><b>22-A</b><span>Sector</span></div><p>Hostile · 12 contacts</p></article>\n' +
            '  <article><div class="stat"><b>09-F</b><span>Sector</span></div><p>Secure · 0 contacts</p></article>\n' +
            '  <article><div class="stat signal"><b>31-B</b><span>Sector</span></div><p>Contested · 3 contacts</p></article>\n' +
            '</div>'
          );
        },
      },
    },
    {
      group: 'Interactive',
      id: 'toast',
      title: 'Toast',
      blurb:
        'The floating cousin of the inline alert, raised imperatively: <code>VantaUI.toast(message, options)</code>. The helper owns a live-region <code>.toaster</code> (created on demand) and each toast reuses the alert rail + glyph, slides in, and auto-dismisses. Tone with <code>info</code> · <code>warn</code> · <code>threat</code> · <code>secure</code>; pass <code>title</code>, <code>duration</code>, or <code>role:"alert"</code> for urgent notices.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <button type="submit" class="secure"\n    onclick="vui.toast(\'Uplink restored\', {tone:\'secure\', title:\'Comms\'})">Secure</button>\n  <button class="amber"\n    onclick="vui.toast(\'Motion flagged in grid 22-A\', {tone:\'warn\'})">Warn</button>\n  <button class="danger"\n    onclick="vui.toast(\'Contact lost: rerouting\', {tone:\'threat\', title:\'Alert\', role:\'alert\'})">Threat</button>\n  <button class="ghost"\n    onclick="vui.toast(\'Scan complete. 14 contacts logged.\')">Info</button>\n</div>',
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
          resize: true,
          code: '<body class="vui">\n  <nav class="left" aria-label="Rail">\n    <img src="emblem.svg" alt="">\n    <a class="active"><i>space_dashboard</i>Ops</a>\n    <a><i>folder</i>Files</a>\n    <a><i>handyman</i>Tools</a>\n    <span class="max"></span>\n    <a><i>settings</i>Setup</a>\n  </nav>\n  <header>\n    <a>WAYNE<b>TECH</b></a>\n    <nav><a aria-current="page">Overview</a><a>Cases</a></nav>\n    <menu>\n      <span class="badge green dot">Online</span>\n      <button aria-label="User"><i>account_circle</i></button>\n    </menu>\n  </header>\n  <main>\n    <h1>Command Center</h1>\n    <p>Operational overview · night cycle 02:14</p>\n    <div class="vui-autogrid" style="--vui-min:10rem">\n      <article><div class="stat signal"><b>07</b><span>Active cases</span></div></article>\n      <article><div class="stat amber"><b>12</b><span>Hostiles</span></div></article>\n      <article><div class="stat"><b>04:18</b><span>Elapsed</span></div></article>\n    </div>\n  </main>\n</body>',
          demo: '<div class="vui" style="block-size:600px">\n  <nav class="left" aria-label="Rail">\n    <img src="assets/emblem.svg" alt="">\n    <a class="active"><i>space_dashboard</i>Ops</a>\n    <a><i>folder</i>Files</a>\n    <a><i>handyman</i>Tools</a>\n    <span class="max"></span>\n    <a><i>settings</i>Setup</a>\n  </nav>\n  <header>\n    <a>WAYNE<b>TECH</b></a>\n    <nav><a aria-current="page">Overview</a><a>Cases</a></nav>\n    <menu>\n      <span class="badge green dot">Online</span>\n      <button aria-label="User"><i>account_circle</i></button>\n    </menu>\n  </header>\n  <main>\n    <h1>Command Center</h1>\n    <p>Operational overview · night cycle 02:14</p>\n    <div class="vui-autogrid" style="--vui-min:10rem">\n      <article><div class="stat signal"><b>07</b><span>Active cases</span></div></article>\n      <article><div class="stat amber"><b>12</b><span>Hostiles</span></div></article>\n      <article><div class="stat"><b>04:18</b><span>Elapsed</span></div></article>\n    </div>\n  </main>\n</div>',
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
          code: 'import VantaUI from "./js/vantaui.js";\n\n// re-scan after you inject DOM (frameworks, htmx, etc.)\nVantaUI.init(document);\n\n// animate a meter or gauge to a value\nVantaUI.setValue(document.querySelector(".gauge"), 87);\n\n// open / close drawers via [data-open="id"] / [data-close]\nVantaUI.drawers(document);\n\n// live clock on any element:\n// <span data-vui-clock>00:00:00</span>',
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
          code: "// Vue\nimport { createApp } from 'vue'\nimport VantaUI from 'vui-css/vue'\nimport 'vui-css'\ncreateApp(App).use(VantaUI).mount('#app')\n\n// Nuxt: nuxt.config.ts\nexport default defineNuxtConfig({\n  modules: ['vui-css/nuxt']\n})",
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
    return s.replace(
      /([\w-]+)(?:(=)("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,
      function (_, name, eq, val) {
        var o = tk('attr', name);
        if (eq) o += tk('pun', '=');
        if (val) o += tk('str', val);
        return o;
      },
    );
  }
  function hlHTML(code) {
    var re = /(<!--[\s\S]*?-->)|(<\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^<>])*?)(\/?>)/g;
    var out = '',
      last = 0,
      m;
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
    var out = '',
      last = 0,
      m;
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
    var root,
      titleEl,
      codeEl,
      copyBtn,
      owner = null,
      ready = false;

    function ensure() {
      if (ready) return;
      root = document.getElementById('doc-codepanel');
      if (!root) return;
      titleEl = root.querySelector('.doc-codepanel__title');
      codeEl = root.querySelector('.doc-codepanel__pre code');
      copyBtn = root.querySelector('.doc-codepanel__copy');

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
      // The native <dialog> + VantaUI.drawers() handle Esc, the backdrop and
      // the [data-close] button; we just forget the owner once it's closed.
      root.addEventListener('close', function () {
        owner = null;
      });
      ready = true;
    }

    function fill(title, code) {
      titleEl.textContent = title;
      codeEl.innerHTML = highlight(code);
    }
    function open(id, title, fn) {
      ensure();
      if (!root) return;
      owner = id;
      fill(title, fn());
      if (!root.open) root.showModal();
    }
    function refresh(id, title, fn) {
      if (root && root.open && owner === id) fill(title, fn());
    }
    function close() {
      if (root && root.open) root.close();
    }
    return {open: open, refresh: refresh, close: close};
  })();

  /* ============================================================
     RENDERER
     ============================================================ */
  function el(tag, cls) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  /* ---- resizable preview lane (drag the trailing edge to test responsiveness)
     The lane stays full-width; the demo shrinks inside it and the grip rides the
     demo's trailing edge. A live width readout shows while dragging. Playgrounds
     repaint the demo's innerHTML, so reattachResize() re-homes the grip + readout
     after each paint. ---- */
  var RESIZE_MIN = 240;

  function reattachResize(demo) {
    if (demo._resize) {
      demo.appendChild(demo._resize.handle);
      demo.appendChild(demo._resize.readout);
    }
  }

  function resizableLane(demo) {
    var lane = el('div', 'doc-resize');
    var handle = el('div', 'doc-resize__handle');
    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-orientation', 'vertical');
    handle.setAttribute('aria-label', 'Drag to resize the preview');
    handle.setAttribute('title', 'Drag to resize');
    handle.tabIndex = 0;
    var readout = el('div', 'doc-resize__readout');
    demo._resize = {handle: handle, readout: readout};

    lane.appendChild(demo);
    demo.appendChild(handle);
    demo.appendChild(readout);

    function widthNow() {
      return Math.round(demo.getBoundingClientRect().width);
    }
    function apply(px) {
      var maxW = lane.clientWidth;
      var w = Math.max(RESIZE_MIN, Math.min(Math.round(px), maxW));
      /* dropping the property hands width back to the fluid 100% default */
      if (w >= maxW) demo.style.removeProperty('inline-size');
      else demo.style.inlineSize = w + 'px';
      readout.textContent = widthNow() + 'px';
    }

    var startX = 0,
      startW = 0;
    function onMove(e) {
      apply(startW + (e.clientX - startX));
    }
    function onUp() {
      lane.classList.remove('is-dragging');
      document.body.style.removeProperty('cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    handle.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      startX = e.clientX;
      startW = widthNow();
      readout.textContent = startW + 'px';
      lane.classList.add('is-dragging');
      document.body.style.cursor = 'ew-resize';
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 48 : 16;
      if (e.key === 'ArrowLeft') apply(widthNow() - step);
      else if (e.key === 'ArrowRight') apply(widthNow() + step);
      else if (e.key === 'Home') apply(RESIZE_MIN);
      else if (e.key === 'End') apply(lane.clientWidth);
      else return;
      e.preventDefault();
      lane.classList.add('is-dragging');
      clearTimeout(handle._hideT);
      handle._hideT = setTimeout(function () {
        lane.classList.remove('is-dragging');
      }, 900);
    });

    return lane;
  }

  /* ---- a single playground control (select / toggle / range) ---- */
  function controlNode(ctrl, state, onChange) {
    if (ctrl.type === 'toggle') {
      var lab = el('label');
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
      var rlab = el('label');
      var span = el('span');
      span.innerHTML =
        ctrl.label +
        ' <b class="vui-text-cyan vui-font-hud">' +
        state[ctrl.key] +
        (ctrl.suffix || '') +
        '</b>';
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
    var slab = el('label');
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

    var wrap = el('article', 'doc-play bleed stage');
    var stage = el(
      'div',
      'doc-demo doc-play__stage' + (play.frame ? ' doc-play__stage--frame' : ''),
    );
    var panel = el('footer', 'doc-play__panel');
    var controls = el('div', 'doc-play__controls');

    function code() {
      return play.render(state);
    }
    function paint() {
      stage.innerHTML = code();
      reattachResize(stage);
      if (window.vui && window.vui.init) window.vui.init(stage);
      CodePanel.refresh(sec.id, sec.title, code);
      if (play.postPaint) play.postPaint(stage, state, paint);
    }

    play.controls.forEach(function (c) {
      controls.appendChild(controlNode(c, state, paint));
    });

    var actions = el('div', 'doc-play__actions');

    var copy = el('button', 'icon');
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Copy code');
    copy.innerHTML = '<i>content_copy</i>';
    copy.addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(code());
      var ic = copy.querySelector('i');
      ic.textContent = 'check';
      setTimeout(function () {
        ic.textContent = 'content_copy';
      }, 1200);
    });

    var view = el('button', 'doc-viewcode vui-notch');
    view.type = 'button';
    view.innerHTML = '<i>code</i><span>View code</span>';
    view.addEventListener('click', function () {
      CodePanel.open(sec.id, sec.title, code);
    });

    actions.appendChild(copy);
    actions.appendChild(view);
    panel.appendChild(controls);
    panel.appendChild(actions);
    wrap.appendChild(play.resize ? resizableLane(stage) : stage);
    wrap.appendChild(panel);
    paint();
    return wrap;
  }

  var exUid = 0;

  /* ---- a static example: live demo + view-code (or inline code for snippets) ---- */
  function exampleNode(ex, sec) {
    if (ex.noDemo) {
      /* reference snippet: keep the code inline, it IS the content (no stage —
         there is no recessed demo body, just a code block in a chamfered box) */
      var snippet = el('div', 'doc-example bleed vui-chamfer');
      snippet.innerHTML =
        '<div class="doc-code">' +
        '<button class="icon small doc-copy" type="button" aria-label="Copy code"><i>content_copy</i></button>' +
        '<pre><code>' +
        highlight(ex.code) +
        '</code></pre>' +
        '</div>';
      return snippet;
    }

    var wrap = el('article', 'doc-example bleed stage');

    var demo = el('div', 'doc-demo' + (ex.frame ? ' doc-demo--frame' : ''));
    demo.innerHTML = ex.demo || ex.code;
    wrap.appendChild(ex.resize ? resizableLane(demo) : demo);

    var foot = el('footer', 'doc-example__foot');
    if (ex.label) {
      var l = el('span', 'doc-example__label');
      l.textContent = ex.label;
      foot.appendChild(l);
    }
    var id = 'ex' + ++exUid;
    var src = ex.code;

    var actions = el('div', 'doc-play__actions');

    var copy = el('button', 'icon');
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Copy code');
    copy.innerHTML = '<i>content_copy</i>';
    copy.addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(src);
      var ic = copy.querySelector('i');
      ic.textContent = 'check';
      setTimeout(function () {
        ic.textContent = 'content_copy';
      }, 1200);
    });

    var view = el('button', 'doc-viewcode vui-notch');
    view.type = 'button';
    view.innerHTML = '<i>code</i><span>View code</span>';
    view.addEventListener('click', function () {
      CodePanel.open(id, sec.title, function () {
        return src;
      });
    });

    actions.appendChild(copy);
    actions.appendChild(view);
    foot.appendChild(actions);
    wrap.appendChild(foot);
    return wrap;
  }

  function render() {
    var main = document.getElementById('doc-main');
    var nav = document.getElementById('doc-nav');
    var groups = {};
    var order = [];

    SECTIONS.forEach(function (sec) {
      var s = el('section', 'vui-section vui-prose');
      s.id = sec.id;
      s.innerHTML =
        '<h2>' + sec.title + '</h2>' + (sec.blurb ? '<p class="blurb">' + sec.blurb + '</p>' : '');

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

  /* scrollspy: highlight active nav link */
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
      {rootMargin: '-12% 0px -78% 0px', threshold: 0},
    );
    document.querySelectorAll('.vui-section').forEach(function (s) {
      io.observe(s);
    });
  }

  /* geometry switch: flip the whole docs between the corner-shape engine and
     the clip-path fallback by toggling .vui-clip on <body> (persisted). */
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

  function boot() {
    render();
    wireCopy();
    wireSpy();
    wireGeometry();
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
    module.exports = {SECTIONS: SECTIONS, highlight: highlight};
  }
})();
