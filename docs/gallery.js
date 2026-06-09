/* ============================================================
   VantaUI docs — gallery data + renderer.
   Each example's live demo AND its code block are rendered from the
   same `code` string, so they can never drift. Sections are grouped
   for the sidebar nav. Token galleries use a `render()` instead.
   ============================================================ */
(function () {
  'use strict';

  /* ---- token data for the foundation galleries ---- */
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
            '<div class="doc-swatch" style="background:var(--' +
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
        'Three ingredients — <strong>Settings, Elements, Helpers</strong>. Add <code>class="vui"</code> to a root element and bare, semantic HTML (<code>header</code>, <code>nav</code>, <code>article</code>, <code>button</code>, <code>input</code>, <code>table</code>, <code>meter</code>, <code>dialog</code>…) comes alive with zero classes. Deviate from a default with one short <em>helper</em> word (<code>glow</code>, <code>danger</code>, <code>small</code>, <code>left</code>). Icons are <code>&lt;i&gt;home&lt;/i&gt;</code>. Everything ships inside <code>@layer</code>s at zero specificity, so your own styles always win.',
    },
    {
      group: 'Getting started',
      id: 'install',
      title: 'Install',
      blurb:
        'One stylesheet, one icon font. The optional JS adds tabs, the live clock, and meter/gauge animation — the CSS is fully usable without it.',
      examples: [
        {
          label: 'Drop-in (CDN-built file or local copy)',
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
          '<p class="doc-tok-h">Detective cyan — the signal</p>' +
          swatches(CYAN, '--') +
          '<p class="doc-tok-h">Amber · Red · Green — status</p>' +
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
          code: '<div class="vui-cluster" style="font-size:1.6rem">\n  <i>radar</i>\n  <i>shield</i>\n  <i>map</i>\n  <i>bolt</i>\n  <i class="fill">favorite</i>\n  <i>lock</i>\n</div>',
        },
      ],
    },
    {
      group: 'Foundations',
      id: 'effects',
      title: 'Glows & effects',
      blurb:
        'Light is emitted, not cast. Depth comes from inner darkening plus a colored outer glow. Surfaces carry faint hex-grid + scanline texture.',
      examples: [
        {
          code: '<div class="vui-row">\n  <span class="vui-dot"></span>\n  <span class="vui-dot vui-dot--warn"></span>\n  <span class="vui-dot vui-dot--threat"></span>\n  <span class="vui-dot vui-dot--cyan"></span>\n  <span class="vui-dot vui-dot--idle"></span>\n</div>',
        },
        {
          code: '<div class="vui-cluster">\n  <span class="badge cyan vui-glow-cyan">glow-cyan</span>\n  <span class="badge amber vui-glow-amber">glow-amber</span>\n  <span class="badge red vui-glow-red">glow-red</span>\n</div>',
        },
      ],
    },

    /* ---------------- CHROME ---------------- */
    {
      group: 'Chrome',
      id: 'header',
      title: 'Header / app bar',
      blurb:
        'A <code>&lt;header&gt;</code> containing a <code>&lt;nav&gt;</code> becomes an app bar — no class required. The first <code>&lt;a&gt;</code> is the brand; the first <code>&lt;nav&gt;</code> gets <code>margin-inline-end:auto</code> so trailing actions push right automatically. A <code>&lt;form role="search"&gt;</code> is the search shell; a <code>&lt;menu&gt;</code> is the trailing cluster; a bare <code>&lt;hr&gt;</code> is a vertical divider. A container query collapses the nav to a burger when the header itself is narrow (not the viewport).<br><b>Helpers:</b> <code>glow</code> (emissive border) · <code>center</code> (centred nav) · <code>tall</code> (larger block) · <code>sticky</code> (scroll-pinned) · <code>float</code> (detached, chamfered) · <code>bare</code> (transparent surface).',
      examples: [
        {
          code: '<header>\n  <a>VANTA<b>UI</b></a>\n  <nav>\n    <a aria-current="page">Overview</a>\n    <a>Cases</a>\n    <a>Archive</a>\n  </nav>\n  <menu>\n    <button aria-label="Notifications"><i>notifications</i></button>\n    <button aria-label="Account"><i>account_circle</i></button>\n  </menu>\n</header>',
        },
        {
          code: '<header class="glow">\n  <a>VANTA<b>UI</b></a>\n  <nav>\n    <a aria-current="page">Command</a>\n    <a>Intel</a>\n    <a>Comms</a>\n  </nav>\n  <form role="search">\n    <i>search</i>\n    <input type="search" placeholder="Search sectors…">\n  </form>\n  <hr>\n  <menu>\n    <span class="badge green dot">Online</span>\n    <button aria-label="Account"><i>account_circle</i></button>\n  </menu>\n</header>',
        },
        {
          code: '<header class="float">\n  <a>VANTA<b>UI</b></a>\n  <nav>\n    <a aria-current="page">Live</a>\n    <a>Logs</a>\n    <a>Units</a>\n  </nav>\n  <menu>\n    <button type="submit">Deploy</button>\n    <button aria-label="Power"><i>power_settings_new</i></button>\n  </menu>\n</header>',
        },
        {
          code: '<header class="center glow">\n  <a>VANTA<b>UI</b></a>\n  <nav>\n    <a aria-current="page">Overview</a>\n    <a>Cases</a>\n    <a>Map</a>\n    <a>Settings</a>\n  </nav>\n</header>',
        },
      ],
    },
    {
      group: 'Chrome',
      id: 'footer',
      title: 'Footer',
      blurb:
        'A bare <code>&lt;footer&gt;</code> (outside an <code>&lt;article&gt;</code> or <code>&lt;dialog&gt;</code>) is the page footer. The first <code>&lt;a&gt;</code>/heading is the brand; a <code>&lt;nav&gt;</code> or loose <code>&lt;a&gt;</code> elements are links; <code>&lt;small&gt;</code> is the legal line.<br><b>Helpers:</b> <code>status</code> — dense telemetry strip where each direct child is a labelled cell; add <code>signal</code> to a cell for the accent tone. <code>columns</code> — auto-fit sitemap grid of <code>&lt;nav&gt;</code>/<code>&lt;section&gt;</code> columns; a <code>.bottom</code> child spans full width as the base bar.',
      examples: [
        {
          code: '<footer>\n  <a><b>VANTA</b>UI</a>\n  <nav>\n    <a>Docs</a>\n    <a>GitHub</a>\n    <a>Changelog</a>\n  </nav>\n  <span class="max"></span>\n  <small>© 2025 · MIT License</small>\n</footer>',
        },
        {
          code: '<footer class="status">\n  <span><small>UPLINK</small>04:18:22</span>\n  <span class="signal"><small>THREAT</small>HIGH</span>\n  <span><small>SECTOR</small>14-C</span>\n  <span><small>STATUS</small><span class="badge green dot">Online</span></span>\n  <span class="max"></span>\n  <span><small>BUILD</small>1.0.1</span>\n</footer>',
        },
        {
          code: '<footer class="columns">\n  <section>\n    <h6>Framework</h6>\n    <nav><a>Install</a><a>Vue</a><a>Nuxt</a></nav>\n  </section>\n  <section>\n    <h6>Components</h6>\n    <nav><a>Buttons</a><a>Panels</a><a>Forms</a></nav>\n  </section>\n  <section>\n    <h6>Resources</h6>\n    <nav><a>GitHub</a><a>Changelog</a><a>License</a></nav>\n  </section>\n  <div class="bottom">\n    <small>© 2025 VantaUI · MIT</small>\n  </div>\n</footer>',
        },
      ],
    },
    {
      group: 'Chrome',
      id: 'navigation',
      title: 'Navigation',
      blurb:
        'Three navigation patterns, all from bare semantics.<br><b>Breadcrumb:</b> any <code>&lt;nav&gt;</code> with a direct-child <code>&lt;ol&gt;</code> — detected by <code>:has()</code>, zero classes, auto <code>/</code> separators, current item via <code>aria-current="page"</code>.<br><b>Bottom tabbar:</b> <code>&lt;nav class="bottom"&gt;</code> sits in the frame foot slot; add <code>fixed</code> to pin it to the viewport independent of the app frame. Items are <code>&lt;a&gt;</code>/<code>&lt;button&gt;</code> with an <code>&lt;i&gt;</code> + text label.<br><b>Side rail:</b> shown in the App shell example.',
      examples: [
        {
          code: '<nav aria-label="Breadcrumb">\n  <ol>\n    <li><a href="/">Home</a></li>\n    <li><a href="/cases">Cases</a></li>\n    <li><a href="/cases/active">Active</a></li>\n    <li aria-current="page">Bleake Island</li>\n  </ol>\n</nav>',
        },
        {
          frame: true,
          code: '<div class="vui" style="block-size:260px">\n  <main style="padding:20px">\n    <h3>Screen content</h3>\n    <p>The tabbar is in the foot slot of the app frame.</p>\n  </main>\n  <nav class="bottom">\n    <a class="active"><i>space_dashboard</i>Ops</a>\n    <a><i>folder</i>Files</a>\n    <a><i>map</i>Map</a>\n    <a><i>settings</i>Setup</a>\n  </nav>\n</div>',
        },
      ],
    },
    {
      group: 'Chrome',
      id: 'drawer',
      title: 'Off-canvas drawer',
      blurb:
        '<code>&lt;dialog class="left"&gt;</code> or <code>&lt;dialog class="right"&gt;</code> is an edge drawer that slides in with a <code>@starting-style</code> transition. Open with <code>el.showModal()</code>; close with <code>el.close()</code>, <code>Esc</code>, or clicking the backdrop. Structure inside: <code>&lt;header&gt;</code> (brand + close button), <code>&lt;nav&gt;</code> (links with <code>&lt;i&gt;</code> glyphs and optional group headings), <code>&lt;footer&gt;</code> (actions). To wire a burger button: <code>&lt;button data-open="id" aria-controls="id"&gt;</code> (handled by the optional JS) or a plain <code>onclick</code>.',
      examples: [
        {
          code: '<button onclick="this.nextElementSibling.showModal()">Open left drawer</button>\n\n<dialog class="left">\n  <header>\n    <a>VANTA<b>UI</b></a>\n    <button class="icon" aria-label="Close"\n      onclick="this.closest(\'dialog\').close()"><i>close</i></button>\n  </header>\n  <nav>\n    <a class="active"><i>space_dashboard</i>Overview</a>\n    <a><i>folder</i>Case Files</a>\n    <a><i>map</i>City Map</a>\n    <a><i>handyman</i>Loadout</a>\n    <span class="max"></span>\n  </nav>\n  <footer>\n    <button class="ghost block"\n      onclick="this.closest(\'dialog\').close()">Sign out</button>\n  </footer>\n</dialog>',
        },
        {
          code: '<button onclick="this.nextElementSibling.showModal()">Open right drawer</button>\n\n<dialog class="right">\n  <header>\n    <a>Filters</a>\n    <button class="icon" aria-label="Close"\n      onclick="this.closest(\'dialog\').close()"><i>close</i></button>\n  </header>\n  <nav>\n    <h5>Status</h5>\n    <a><i>circle</i>All</a>\n    <a class="active"><i>check_circle</i>Active</a>\n    <a><i>cancel</i>Closed</a>\n    <h5>Threat</h5>\n    <a><i>bolt</i>High</a>\n    <a><i>warning</i>Medium</a>\n  </nav>\n  <footer>\n    <button type="submit" class="block">Apply</button>\n  </footer>\n</dialog>',
        },
      ],
    },

    {
      group: 'Chrome',
      id: 'sidebar',
      title: 'Drawer sidebar',
      blurb:
        'A semantic <code>&lt;aside class="drawer"&gt;</code> (or <code>&lt;nav class="drawer"&gt;</code>) placed in an app frame is a wide, text-labelled sidebar — <strong>persistent on desktop, off-canvas on mobile</strong>, no media queries to write. Structure it like any drawer: a <code>&lt;header&gt;</code> (brand + a <code>data-close</code> button), a <code>&lt;nav&gt;</code> of <code>&lt;a&gt;</code> links with <code>&lt;i&gt;</code> glyphs and <code>&lt;h5&gt;/&lt;h6&gt;</code> group headings, and an optional <code>&lt;footer&gt;</code> for actions. On phones it slides off-canvas; a <code>&lt;button data-open="id"&gt;</code> toggles it (optional JS) and a <code>data-close</code> button, the backdrop, or a link tap dismisses it. Add <code>right</code> to dock it to the trailing edge. Distinct from the narrow icon <code>&lt;nav class="left"&gt;</code> rail — and from the <code>&lt;dialog&gt;</code> off-canvas drawer above, which is always modal. <em>This page&rsquo;s own sidebar is one.</em>',
      examples: [
        {
          frame: true,
          code: '<div class="vui" style="block-size:440px">\n  <aside class="drawer" id="demoDrawer">\n    <header>\n      <span><img src="assets/emblem.svg" alt="">VANTA<b>UI</b></span>\n      <button class="icon vui-until-m" data-close aria-label="Close"><i>close</i></button>\n    </header>\n    <nav>\n      <h6>Telemetry</h6>\n      <a class="active"><i>space_dashboard</i>Overview</a>\n      <a><i>radar</i>Scan</a>\n      <a><i>map</i>City Map</a>\n      <h6>System</h6>\n      <a><i>handyman</i>Loadout</a>\n      <a><i>settings</i>Setup</a>\n    </nav>\n    <footer>\n      <button class="ghost block"><i>logout</i>Sign out</button>\n    </footer>\n  </aside>\n  <header>\n    <button class="icon vui-until-m" data-open="demoDrawer" aria-label="Open menu"><i>menu</i></button>\n    <a>WAYNE<b>TECH</b></a>\n    <menu><button aria-label="Profile"><i>account_circle</i></button></menu>\n  </header>\n  <main>\n    <div class="vui-container">\n      <h1>Command Center</h1>\n      <p>The sidebar is pinned on desktop and collapses to an off-canvas drawer on phones — resize to see it switch.</p>\n    </div>\n  </main>\n</div>',
        },
        {
          frame: true,
          code: '<div class="vui" style="block-size:440px">\n  <header>\n    <a>WAYNE<b>TECH</b></a>\n    <menu><button class="icon vui-until-m" data-open="filtersDrawer" aria-label="Filters"><i>tune</i></button></menu>\n  </header>\n  <main>\n    <div class="vui-container">\n      <h1>Case Files</h1>\n      <p>A trailing sidebar with <code>aside class="drawer right"</code> — useful for filters or inspectors.</p>\n    </div>\n  </main>\n  <aside class="drawer right" id="filtersDrawer">\n    <header>\n      <span>Filters</span>\n      <button class="icon vui-until-m" data-close aria-label="Close"><i>close</i></button>\n    </header>\n    <nav>\n      <h5>Status</h5>\n      <a class="active"><i>check_circle</i>Active</a>\n      <a><i>cancel</i>Closed</a>\n      <h5>Threat</h5>\n      <a><i>bolt</i>High</a>\n      <a><i>warning</i>Medium</a>\n    </nav>\n  </aside>\n</div>',
        },
      ],
    },

    /* ---------------- LAYOUT ---------------- */
    {
      group: 'Layout',
      id: 'grid',
      title: '12-column grid',
      blurb:
        'Mobile-first like BeerCSS: children stack on the smallest screen, then opt into spans with vui-s* / vui-m* / vui-l*.',
      examples: [
        {
          code: '<div class="vui-grid">\n  <article class="vui-s12 vui-m6 vui-l4">A</article>\n  <article class="vui-s12 vui-m6 vui-l4">B</article>\n  <article class="vui-s12 vui-m12 vui-l4">C</article>\n</div>',
        },
      ],
    },
    {
      group: 'Layout',
      id: 'autogrid',
      title: 'Auto grid & flex helpers',
      blurb:
        '<code>vui-autogrid</code> is the responsive-by-default card flow: it fits as many cards as the space allows at your <code>--vui-min</code> width, then reflows down to a single full-width card on a phone — no breakpoints to write. Add <code>--fit</code> so a short last row stretches to fill. Plus the flex utilities the whole system is built from: row, col, stack, cluster, between, center, spacer.',
      examples: [
        {
          code: '<div class="vui-autogrid vui-autogrid--fit" style="--vui-min:13rem">\n  <article>Sector 14-C</article>\n  <article>Sector 22-A</article>\n  <article>Sector 09-F</article>\n  <article>Sector 31-B</article>\n</div>',
        },
        {
          code: '<div class="vui-between">\n  <span class="vui-eyebrow">Sector 14-C</span>\n  <span class="badge green dot">Online</span>\n</div>',
        },
      ],
    },
    {
      group: 'Layout',
      id: 'prose',
      title: 'Prose layout',
      blurb:
        '<code>vui-prose</code> is a responsive-first grid layout for articles and long-form text. It centres text to a readable maximum width (65ch) for optimal typography, while allowing selected elements like images, figure blocks, blockquotes, and code snippets to bleed wider or stretch to the full viewport width. Use <code>vui-bleed</code> (or <code>bleed</code>) to bleed to the sides of the viewport container, and <code>vui-bleed-full</code> (or <code>bleed-full</code>) to stretch edge-to-edge.',
      examples: [
        {
          code: '<article class="vui-prose">\n  <h1>Knightfall Protocol</h1>\n  <p class="vui-eyebrow">Security Level: Classified</p>\n  <p>To preserve the security of Gotham City and protect the identities of those who have aided the mission, the Knightfall Protocol has been established as a final contingency. In the event of primary identity compromise, all core assets are to be decommissioned.</p>\n  \n  <blockquote>"The city needs a legend. Something worse than me. Something that can rise from the ashes..."</blockquote>\n  \n  <h2>Contingency Execution</h2>\n  <p>Upon activation, the Batcomputer will execute a localized self-destruct sequence at Wayne Manor and all auxiliary batcaves, rendering all physical records, tactical gear, and tech research completely unrecoverable.</p>\n  \n  <figure class="bleed">\n    <img src="preview.png" alt="Tactical HUD preview" style="aspect-ratio: 16/9; object-fit: cover;">\n    <figcaption>Fig. 01 — BatOS Tactical HUD visualizer telemetry system.</figcaption>\n  </figure>\n  \n  <p>All field agents (Red Robin, Nightwing, Oracle) are instructed to stand down. Do not attempt to contact Wayne Manor or initiate rescue operations. All communication links will be terminated.</p>\n</article>',
        },
      ],
    },

    /* ---------------- COMPONENTS ---------------- */
    {
      group: 'Components',
      id: 'buttons',
      title: 'Buttons',
      blurb:
        'A bare <code>&lt;button&gt;</code> is a chamfered outline control; <code>type="submit"</code> auto-promotes to the filled primary. Re-tone or resize with one word; a lone <code>&lt;i&gt;</code> collapses it to a square.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <button>Override</button>\n  <button type="submit">Authorize</button>\n  <button class="amber">Caution</button>\n  <button class="danger">Abort</button>\n  <button class="secure">Confirm</button>\n  <button class="ghost">Dismiss</button>\n  <button disabled>Locked</button>\n</div>',
        },
        {
          code: '<div class="vui-cluster">\n  <button class="small">Small</button>\n  <button>Medium</button>\n  <button class="large">Large</button>\n  <button aria-label="Settings"><i>settings</i></button>\n  <button class="icon" aria-pressed="true" aria-label="Radar"><i>radar</i></button>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'panels',
      title: 'Panels',
      blurb:
        'A bare <code>&lt;article&gt;</code> is a chamfered plate; a nested <code>&lt;header&gt;</code>/<code>&lt;footer&gt;</code> auto-spans with a hairline divider. Tune the surface with one word: <code>raised · inset · flat · glow · notch · brackets</code>.',
      examples: [
        {
          code: '<article class="brackets">\n  <header>\n    <small class="vui-eyebrow">Case File</small>\n    <small>14-C</small>\n  </header>\n  <p>Recovered intel from the broker drop. Chain of custody verified.</p>\n  <footer><button class="small">Open</button></footer>\n</article>',
        },
        {
          code: '<div class="vui-grid">\n  <article class="inset vui-s12 vui-m6">Inset well</article>\n  <article class="glow vui-s12 vui-m6">Accent glow</article>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'badges',
      title: 'Badges',
      blurb:
        'Notched status tags. Tone with one word; add <code>dot</code> for a live indicator or <code>solid</code> to fill.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <span class="badge green dot">Online</span>\n  <span class="badge cyan">Encrypted</span>\n  <span class="badge amber solid">Caution</span>\n  <span class="badge red dot">Threat</span>\n  <span class="badge neutral">Idle</span>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'forms',
      title: 'Forms',
      blurb:
        'Native controls are styled directly — no wrappers. A <code>&lt;label&gt;</code> wrapping a field stacks it (with a leading <code>&lt;span&gt;</code> label and a trailing <code>&lt;small&gt;</code> hint); <code>input[role=switch]</code> becomes a toggle; checkboxes/radios draw their own notched marks.',
      examples: [
        {
          code: '<label>\n  <span>Access code</span>\n  <input type="password" placeholder="••••••••" value="wayne">\n  <small>8–32 characters.</small>\n</label>',
        },
        {
          code: '<label>\n  <span>Sector</span>\n  <select>\n    <option>Bleake Island</option>\n    <option>Miagani</option>\n    <option>Founders\'</option>\n  </select>\n</label>',
        },
        {
          code: '<label><input type="checkbox" role="switch" checked> Detective Mode</label>\n<label><input type="checkbox" checked> Mark case solved</label>\n<label><input type="radio" name="d" checked> Normal</label>\n<label><input type="radio" name="d"> Knightmare</label>',
        },
        {
          code: '<label>\n  <span>Frequency</span>\n  <input type="range" min="0" max="100" value="62">\n</label>\n<label>\n  <span>Notes</span>\n  <textarea placeholder="Field report…"></textarea>\n</label>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'alerts',
      title: 'Alerts',
      blurb:
        'Inline system notices with an accent rail + glyph. <code>[role=status]</code> reads as info, <code>[role=alert]</code> as threat. Re-tone with one word (<code>warn · secure · info</code>); a nested <code>&lt;strong&gt;</code> becomes the title.',
      examples: [
        {
          code: '<div role="alert">\n  <strong>Hostiles inbound</strong>\n  12 contacts · grid 14-C · ETA 2m\n</div>',
        },
        {
          code: '<div role="status" class="secure">\n  <strong>Uplink secure</strong>\n  Channel encrypted end-to-end.\n</div>\n<div role="status" class="warn" style="margin-block-start:12px">\n  <strong>Drone sweep</strong>\n  Aerial recon over Founders\' Island.\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'meters',
      title: 'Meters & progress',
      blurb:
        'Native <code>&lt;meter&gt;</code> and <code>&lt;progress&gt;</code> become telemetry bars. The <code>.meter</code> helper adds a label + auto value readout, driven purely by <code>--value</code>. Add <code>data-animate</code> (with the JS helper) to count up on view.',
      examples: [
        {
          code: '<meter min="0" max="100" low="30" high="70" optimum="100" value="86"></meter>\n<progress max="100" value="62"></progress>',
        },
        {
          code: '<div class="meter segmented" style="--value:73">\n  <span>Suit Integrity</span>\n  <b></b>\n</div>',
        },
        {
          code: '<div class="meter amber" data-value="62" data-animate style="--value:0">\n  <span>Threat Level</span>\n  <b></b>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'gauge',
      title: 'Radial gauge',
      blurb:
        'A 270° arc readout built from a single conic-gradient — no SVG, no JS. Value renders from <code>--value</code>; size with <code>small · large</code>, tone with <code>amber · red · green</code>.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <div class="gauge" style="--value:87">\n    <b></b><small>%</small>\n    <span>Integrity</span>\n  </div>\n  <div class="gauge amber small" style="--value:42">\n    <b></b><small>%</small>\n    <span>Threat</span>\n  </div>\n</div>',
        },
      ],
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
        'Native <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> styled as a chamfered, zero-JS disclosure.',
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
        'A semantic <code>&lt;table&gt;</code> becomes a telemetry grid: uppercase eyebrow headers, hairline rows, cyan hover. Mark numeric cells with <code>data-num</code>. Wrap in a <code>.scroll</code> for overflow on phones.',
      examples: [
        {
          code: '<div class="scroll">\n<table>\n  <caption>District status</caption>\n  <thead><tr><th>Sector</th><th>Status</th><th data-num>Threat</th></tr></thead>\n  <tbody>\n    <tr><td>Bleake Island</td><td>Contested</td><td data-num>64</td></tr>\n    <tr><td>Miagani</td><td>Hostile</td><td data-num>86</td></tr>\n    <tr><td>Founders\'</td><td>Secure</td><td data-num>38</td></tr>\n  </tbody>\n</table>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'overlays',
      title: 'Dialog, tooltip, divider',
      blurb:
        'Native <code>&lt;dialog&gt;</code> as a chamfered modal with a scrim, a hover tooltip (<code>[data-tip]</code>), a labelled <code>.divider</code>, and <code>.kv</code> / <code>.stat</code> readouts.',
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
        'Any <code>.vui</code> element holding a <code>&lt;main&gt;</code> becomes an app frame and places its landmarks by element. Add a <code>&lt;nav class="left"&gt;</code> for a narrow side rail, or a semantic <code>&lt;aside class="drawer"&gt;</code> / <code>&lt;nav class="drawer"&gt;</code> for a wide text-based sidebar (persistent on desktop, collapsible on mobile). Shown here boxed.',
      examples: [
        {
          frame: true,
          code: '<div class="vui" style="block-size:440px">\n  <nav class="left" aria-label="Rail">\n    <img src="assets/emblem.svg" alt="">\n    <a class="active"><i>space_dashboard</i>Ops</a>\n    <a><i>folder</i>Files</a>\n    <a><i>handyman</i>Tools</a>\n    <span class="max"></span>\n    <a><i>settings</i>Setup</a>\n  </nav>\n  <header>\n    <a>WAYNE<b>TECH</b></a>\n    <nav><a aria-current="page">Overview</a><a>Cases</a></nav>\n    <menu>\n      <span class="badge green dot">Online</span>\n      <button aria-label="User"><i>account_circle</i></button>\n    </menu>\n  </header>\n  <main>\n    <h1>Command Center</h1>\n    <p>Operational overview · night cycle 02:14</p>\n    <div class="vui-autogrid" style="--vui-min:10rem">\n      <article><div class="stat signal"><b>07</b><span>Active cases</span></div></article>\n      <article><div class="stat amber"><b>12</b><span>Hostiles</span></div></article>\n      <article><div class="stat"><b>04:18</b><span>Elapsed</span></div></article>\n    </div>\n  </main>\n</div>',
        },
        {
          frame: true,
          code: '<div class="vui" style="block-size:440px">\n  <aside class="drawer" id="shellDrawer">\n    <header>\n      <span><img src="assets/emblem.svg" alt="">VANTA<b>UI</b></span>\n      <button class="icon vui-until-m" data-close aria-label="Close"><i>close</i></button>\n    </header>\n    <nav>\n      <h6>Telemetry</h6>\n      <a class="active"><i>space_dashboard</i>Overview</a>\n      <a><i>radar</i>Scan</a>\n      <h6>Settings</h6>\n      <a><i>settings</i>Setup</a>\n    </nav>\n  </aside>\n  <header>\n    <button class="doc-menu-btn vui-until-m" data-open="shellDrawer" aria-label="Open menu" style="position:absolute;top:8px;left:8px;inline-size:32px;block-size:32px;display:grid;place-items:center;background:var(--surface-panel);border:1px solid var(--hairline-accent);clip-path:var(--clip-notch);--bevel-sm:5px;font-size:16px;cursor:pointer"><i>menu</i></button>\n    <a style="margin-inline-start:44px">WAYNE<b>TECH</b></a>\n    <menu>\n      <button aria-label="Profile"><i>account_circle</i></button>\n    </menu>\n  </header>\n  <main>\n    <div class="vui-container">\n      <h1>Documentation</h1>\n      <p>This layout uses a persistent drawer on desktop, which collapses into an off-canvas drawer on mobile. Use a <code>vui-container</code> inside <code>main</code> to keep content readable and scrollbars on the screen edge.</p>\n    </div>\n  </main>\n</div>',
        },
      ],
    },
    {
      group: 'Patterns',
      id: 'js',
      title: 'JavaScript helpers',
      blurb:
        'Optional and zero-dependency. <code>VantaUI.init()</code> runs on load; call it again after injecting markup. <code>VantaUI.setValue(el, n)</code> animates a meter/gauge; <code>[data-vui-clock]</code> ticks live.',
      examples: [
        {
          noDemo: true,
          code: 'import VantaUI from "./js/vantaui.js";\n\n// re-scan after you inject DOM (frameworks, htmx, etc.)\nVantaUI.init(document);\n\n// animate a meter or gauge to a value\nVantaUI.setValue(document.querySelector(".gauge"), 87);\n\n// live clock — any element:\n// <span data-vui-clock>00:00:00</span>',
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
     RENDERER
     ============================================================ */
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---- tiny zero-dependency syntax highlighter (HTML + JS) ----
     Tokenises the raw source and emits escaped text wrapped in .tk-* spans,
     themed via the docs stylesheet. textContent of the result is still the
     plain code, so the copy button keeps working. */
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

  function exampleNode(ex) {
    var wrap = document.createElement('div');
    /* `bleed` lets the live demo + code widen past the prose reading column */
    wrap.className = 'doc-example bleed';
    var demo = '';
    if (!ex.noDemo) {
      demo =
        '<div class="doc-demo' + (ex.frame ? ' doc-demo--frame' : '') + '">' + ex.code + '</div>';
    }
    wrap.innerHTML =
      demo +
      '<div class="doc-code">' +
      '<button class="doc-copy" type="button" aria-label="Copy code"><i>content_copy</i></button>' +
      '<pre><code>' +
      highlight(ex.code) +
      '</code></pre>' +
      '</div>';
    return wrap;
  }

  function render() {
    var main = document.getElementById('doc-main');
    var nav = document.getElementById('doc-nav');
    var groups = {};
    var order = [];

    SECTIONS.forEach(function (sec) {
      var s = document.createElement('section');
      /* each section is a prose article: the heading + blurb sit in the
         readable measure, demos/code/token galleries bleed wider */
      s.className = 'doc-section vui-prose';
      s.id = sec.id;
      var head =
        '<div class="doc-section__head">' +
        '<h2 class="doc-section__title">' +
        sec.title +
        '</h2>' +
        (sec.blurb ? '<p class="doc-section__blurb">' + sec.blurb + '</p>' : '') +
        '</div>';
      s.innerHTML = head;

      if (sec.render) {
        var custom = document.createElement('div');
        custom.className = 'doc-tokens bleed';
        custom.innerHTML = sec.render();
        s.appendChild(custom);
      }
      (sec.examples || []).forEach(function (ex) {
        s.appendChild(exampleNode(ex));
      });
      main.appendChild(s);

      if (!groups[sec.group]) {
        groups[sec.group] = [];
        order.push(sec.group);
      }
      groups[sec.group].push(sec);
    });

    /* nav */
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

  /* copy buttons */
  function wireCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.doc-copy');
      if (!btn) return;
      var code = btn.parentNode.querySelector('code').textContent;
      navigator.clipboard && navigator.clipboard.writeText(code);
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
      {rootMargin: '-12% 0px -78% 0px', threshold: 0},
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
