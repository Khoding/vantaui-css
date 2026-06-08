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
        'Write proper, semantic HTML — get a tactical HUD. Add <code>class="vui"</code> to a root element and bare elements (<code>button</code>, <code>article</code>, <code>input</code>, <code>table</code>, <code>meter</code>, <code>dialog</code>…) come alive with zero classes. Opt into variants with <code>data-*</code> attributes or terse <code>vui-*</code> classes. Everything ships inside <code>@layer</code>s, so your own unlayered styles always win.',
    },
    {
      group: 'Getting started',
      id: 'install',
      title: 'Install',
      blurb:
        'One stylesheet. The optional JS adds tabs, the live clock, and meter/gauge animation — the CSS is fully usable without it.',
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
      id: 'effects',
      title: 'Glows & effects',
      blurb:
        'Light is emitted, not cast. Depth comes from inner darkening plus a colored outer glow. Surfaces carry faint hex-grid + scanline texture.',
      examples: [
        {
          code: '<div class="vui-row">\n  <span class="vui-dot"></span>\n  <span class="vui-dot vui-dot--warn"></span>\n  <span class="vui-dot vui-dot--threat"></span>\n  <span class="vui-dot vui-dot--cyan"></span>\n  <span class="vui-dot vui-dot--idle"></span>\n</div>',
        },
        {
          code: '<div class="vui-cluster">\n  <span class="vui-badge vui-glow-cyan">glow-cyan</span>\n  <span class="vui-badge vui-badge--amber vui-glow-amber">glow-amber</span>\n  <span class="vui-badge vui-badge--red vui-glow-red">glow-red</span>\n</div>',
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
          code: '<div class="vui-between">\n  <span class="vui-eyebrow">Sector 14-C</span>\n  <span class="vui-badge vui-badge--green vui-badge--dot">Online</span>\n</div>',
        },
      ],
    },

    /* ---------------- COMPONENTS ---------------- */
    {
      group: 'Components',
      id: 'buttons',
      title: 'Buttons',
      blurb:
        'A bare <code>&lt;button&gt;</code> is a chamfered outline control; <code>type="submit"</code> auto-promotes to the filled primary. Tone via <code>data-tone</code>, size via <code>data-size</code>. A lone icon collapses to a square.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <button>Override</button>\n  <button type="submit">Authorize</button>\n  <button data-tone="amber">Caution</button>\n  <button data-tone="danger">Abort</button>\n  <button data-tone="secure">Confirm</button>\n  <button class="vui-btn--ghost">Dismiss</button>\n  <button disabled>Locked</button>\n</div>',
        },
        {
          code: '<div class="vui-cluster">\n  <button data-size="sm">Small</button>\n  <button>Medium</button>\n  <button data-size="lg">Large</button>\n  <button><i class="ti ti-settings"></i></button>\n  <button class="vui-btn--icon" aria-pressed="true"><i class="ti ti-radar-2"></i></button>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'panels',
      title: 'Panels',
      blurb:
        'A bare <code>&lt;article&gt;</code> is a chamfered plate; a nested <code>&lt;header&gt;</code>/<code>&lt;footer&gt;</code> auto-spans with a hairline divider. Add <code>data-brackets</code> or <code>data-glow</code>, or the depth classes.',
      examples: [
        {
          code: '<article data-brackets>\n  <header>\n    <span class="vui-panel__eyebrow">Case File</span>\n    <span class="vui-panel__aside">14-C</span>\n  </header>\n  <p>Recovered intel from the broker drop. Chain of custody verified.</p>\n  <footer><button data-size="sm">Open</button></footer>\n</article>',
        },
        {
          code: '<div class="vui-grid">\n  <div class="vui-panel vui-panel--inset vui-s12 vui-m6">Inset well</div>\n  <div class="vui-panel vui-panel--glow vui-s12 vui-m6">Accent glow</div>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'badges',
      title: 'Badges',
      blurb:
        'Notched status tags. Tone via class or <code>data-tone</code>; add <code>--dot</code> for a live indicator or <code>--solid</code> to fill.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <span class="vui-badge vui-badge--green vui-badge--dot">Online</span>\n  <span class="vui-badge vui-badge--cyan">Encrypted</span>\n  <span class="vui-badge vui-badge--amber vui-badge--solid">Caution</span>\n  <span class="vui-badge vui-badge--red vui-badge--dot">Threat</span>\n  <span class="vui-badge vui-badge--neutral">Idle</span>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'forms',
      title: 'Forms',
      blurb:
        'Native controls are styled directly — no wrappers. A <code>&lt;label&gt;</code> wrapping a field stacks it; <code>input[role=switch]</code> becomes a toggle; checkboxes/radios draw their own notched marks.',
      examples: [
        {
          code: '<label>\n  <span class="vui-field__label">Access code</span>\n  <input type="password" placeholder="••••••••" value="wayne">\n</label>',
        },
        {
          code: '<div class="vui-input-wrap">\n  <i class="ti ti-search"></i>\n  <input placeholder="Search dossier…">\n</div>',
        },
        {
          code: '<label>\n  <span class="vui-field__label">Sector</span>\n  <select>\n    <option>Bleake Island</option>\n    <option>Miagani</option>\n    <option>Founders\'</option>\n  </select>\n</label>',
        },
        {
          code: '<label><input type="checkbox" role="switch" checked> Detective Mode</label>\n<label><input type="checkbox" checked> Mark case solved</label>\n<label><input type="radio" name="d" checked> Normal</label>\n<label><input type="radio" name="d"> Knightmare</label>',
        },
        {
          code: '<label>\n  <span class="vui-field__label">Frequency</span>\n  <input type="range" min="0" max="100" value="62">\n</label>\n<label>\n  <span class="vui-field__label">Notes</span>\n  <textarea placeholder="Field report…"></textarea>\n</label>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'alerts',
      title: 'Alerts',
      blurb:
        'Inline system notices with an accent rail + glyph. <code>[role=status]</code> reads as info, <code>[role=alert]</code> as threat. Tone via <code>data-tone</code>; a nested <code>&lt;strong&gt;</code> becomes the title.',
      examples: [
        {
          code: '<div role="alert">\n  <strong>Hostiles inbound</strong>\n  12 contacts · grid 14-C · ETA 2m\n</div>',
        },
        {
          code: '<div class="vui-alert" data-tone="secure">\n  <strong>Uplink secure</strong>\n  Channel encrypted end-to-end.\n</div>\n<div class="vui-alert" data-tone="warn" style="margin-block-start:12px">\n  <strong>Drone sweep</strong>\n  Aerial recon over Founders\' Island.\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'meters',
      title: 'Meters & progress',
      blurb:
        'Native <code>&lt;meter&gt;</code> and <code>&lt;progress&gt;</code> become telemetry bars. The <code>.vui-meter</code> composite adds a label + auto value readout, driven purely by <code>--value</code>. Add <code>data-animate</code> (with the JS helper) to count up on view.',
      examples: [
        {
          code: '<meter min="0" max="100" low="30" high="70" optimum="100" value="86"></meter>\n<progress max="100" value="62"></progress>',
        },
        {
          code: '<div class="vui-meter vui-meter--segmented" style="--value:73">\n  <div class="vui-meter__top">\n    <span class="vui-meter__label">Suit Integrity</span>\n    <span class="vui-meter__val"></span>\n  </div>\n  <div class="vui-meter__track"><div class="vui-meter__fill"></div></div>\n</div>',
        },
        {
          code: '<div class="vui-meter vui-meter--amber" data-value="62" data-animate style="--value:0">\n  <div class="vui-meter__top">\n    <span class="vui-meter__label">Threat Level</span>\n    <span class="vui-meter__val"></span>\n  </div>\n  <div class="vui-meter__track"><div class="vui-meter__fill"></div></div>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'gauge',
      title: 'Radial gauge',
      blurb:
        'A 270° arc readout built from a single conic-gradient — no SVG, no JS. Value renders from <code>--value</code>; tones and sizes via modifier classes.',
      examples: [
        {
          code: '<div class="vui-cluster">\n  <div class="vui-gauge" style="--value:87">\n    <b class="vui-gauge__value"></b><small>%</small>\n    <span class="vui-gauge__label">Integrity</span>\n  </div>\n  <div class="vui-gauge vui-gauge--amber vui-gauge--sm" style="--value:42">\n    <b class="vui-gauge__value"></b><small>%</small>\n    <span class="vui-gauge__label">Threat</span>\n  </div>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'tabs',
      title: 'Tabs',
      blurb:
        'Semantic <code>nav[role=tablist]</code> + <code>button[role=tab]</code>. The optional JS wires clicks, arrow keys, and panel visibility via <code>aria-controls</code>.',
      examples: [
        {
          code: '<nav role="tablist">\n  <button role="tab" aria-controls="t-cases" aria-selected="true">Case Files <span class="vui-tab__count">7</span></button>\n  <button role="tab" aria-controls="t-map">City Map</button>\n  <button role="tab" aria-controls="t-gear">Loadout</button>\n</nav>\n<div role="tabpanel" id="t-cases">Seven open cases in the active sweep.</div>\n<div role="tabpanel" id="t-map" hidden>City map module offline.</div>\n<div role="tabpanel" id="t-gear" hidden>Three gadgets equipped.</div>',
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
        'A semantic <code>&lt;table&gt;</code> becomes a telemetry grid: uppercase eyebrow headers, hairline rows, cyan hover. Mark numeric cells with <code>data-num</code>.',
      examples: [
        {
          code: '<div class="vui-table-scroll">\n<table>\n  <caption>District status</caption>\n  <thead><tr><th>Sector</th><th>Status</th><th data-num>Threat</th></tr></thead>\n  <tbody>\n    <tr><td>Bleake Island</td><td>Contested</td><td data-num>64</td></tr>\n    <tr><td>Miagani</td><td>Hostile</td><td data-num>86</td></tr>\n    <tr><td>Founders\'</td><td>Secure</td><td data-num>38</td></tr>\n  </tbody>\n</table>\n</div>',
        },
      ],
    },
    {
      group: 'Components',
      id: 'overlays',
      title: 'Dialog, tooltip, divider',
      blurb:
        'Native <code>&lt;dialog&gt;</code> as a chamfered modal with a scrim, a hover tooltip, a labelled divider, and key/value + stat readouts.',
      examples: [
        {
          code: '<button onclick="this.nextElementSibling.showModal()">Open dialog</button>\n<dialog>\n  <header>\n    <span class="vui-panel__eyebrow">Confirm</span>\n    <button class="vui-btn--icon" onclick="this.closest(\'dialog\').close()"><i class="ti ti-x"></i></button>\n  </header>\n  <div class="vui-dialog__body">Engage the Knightfall protocol?</div>\n  <footer>\n    <button class="vui-btn--ghost" onclick="this.closest(\'dialog\').close()">Cancel</button>\n    <button type="submit" data-tone="danger" onclick="this.closest(\'dialog\').close()">Engage</button>\n  </footer>\n</dialog>',
        },
        {
          code: '<span class="vui-tooltip" data-tip="Decryption in progress" tabindex="0">\n  <button class="vui-btn--icon"><i class="ti ti-lock"></i></button>\n</span>\n<div class="vui-divider" data-label="Sector 14-C" style="margin-block:16px"></div>\n<div class="vui-kv"><span>Operator</span><span>B. Wayne</span></div>\n<div class="vui-stat vui-stat--signal"><b>98.6</b><span>Integrity</span></div>',
        },
      ],
    },

    /* ---------------- PATTERNS ---------------- */
    {
      group: 'Patterns',
      id: 'appshell',
      title: 'App shell',
      blurb:
        'The tactical desktop layout — left rail + top bar + scrolling stage. Responsive: the rail drops to a bottom command bar on phones. Shown here boxed.',
      examples: [
        {
          frame: true,
          code: '<div class="vui-app">\n  <nav class="vui-rail">\n    <div class="vui-rail__emblem"><img src="../assets/emblem.svg" alt="VantaUI"></div>\n    <button class="vui-rail__item vui-rail__item--active"><i class="ti ti-layout-dashboard"></i></button>\n    <button class="vui-rail__item"><i class="ti ti-files"></i></button>\n    <button class="vui-rail__item"><i class="ti ti-tools"></i></button>\n    <div class="vui-rail__spacer"></div>\n    <button class="vui-rail__item"><i class="ti ti-settings"></i></button>\n  </nav>\n  <header class="vui-topbar">\n    <span class="vui-topbar__eyebrow"><b>//</b> WayneTech OS</span>\n    <div class="vui-topbar__spacer"></div>\n    <span class="vui-topbar__stat"><span class="vui-dot"></span> Online</span>\n    <span class="vui-topbar__user">BW</span>\n  </header>\n  <main class="vui-stage">\n    <div class="vui-stage__inner">\n      <div class="vui-screen-head">\n        <div>\n          <h1 class="vui-screen-title">Command Center</h1>\n          <p class="vui-screen-sub">Operational overview · night cycle 02:14</p>\n        </div>\n        <button data-tone="amber">Knightfall</button>\n      </div>\n      <div class="vui-grid">\n        <article class="vui-s12 vui-m4"><div class="vui-stat vui-stat--signal"><b>07</b><span>Active cases</span></div></article>\n        <article class="vui-s12 vui-m4"><div class="vui-stat vui-stat--amber"><b>12</b><span>Hostiles</span></div></article>\n        <article class="vui-s12 vui-m4"><div class="vui-stat"><b>04:18</b><span>Elapsed</span></div></article>\n      </div>\n    </div>\n  </main>\n</div>',
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
          code: 'import VantaUI from "./js/vantaui.js";\n\n// re-scan after you inject DOM (frameworks, htmx, etc.)\nVantaUI.init(document);\n\n// animate a meter or gauge to a value\nVantaUI.setValue(document.querySelector(".vui-gauge"), 87);\n\n// live clock — any element:\n// <span data-vui-clock>00:00:00</span>',
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

  function exampleNode(ex) {
    var wrap = document.createElement('div');
    wrap.className = 'doc-example';
    var demo = '';
    if (!ex.noDemo) {
      demo =
        '<div class="doc-demo' + (ex.frame ? ' doc-demo--frame' : '') + '">' + ex.code + '</div>';
    }
    wrap.innerHTML =
      demo +
      '<div class="doc-code">' +
      '<button class="doc-copy" type="button" aria-label="Copy code"><i class="ti ti-copy"></i></button>' +
      '<pre><code>' +
      esc(ex.code) +
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
      s.className = 'doc-section';
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
        custom.className = 'doc-tokens';
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
      var blk = document.createElement('div');
      blk.className = 'doc-nav__group';
      blk.innerHTML = '<p class="doc-nav__label">' + g + '</p>';
      groups[g].forEach(function (sec) {
        var a = document.createElement('a');
        a.href = '#' + sec.id;
        a.className = 'doc-nav__link';
        a.dataset.target = sec.id;
        a.textContent = sec.title;
        blk.appendChild(a);
      });
      nav.appendChild(blk);
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
      var prev = i.className;
      i.className = 'ti ti-check';
      btn.classList.add('is-copied');
      setTimeout(function () {
        i.className = prev;
        btn.classList.remove('is-copied');
      }, 1200);
    });
  }

  /* scrollspy — highlight active nav link */
  function wireSpy() {
    var links = [].slice.call(document.querySelectorAll('.doc-nav__link'));
    var map = {};
    links.forEach(function (l) {
      map[l.dataset.target] = l;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove('is-active');
            });
            var active = map[en.target.id];
            if (active) active.classList.add('is-active');
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
