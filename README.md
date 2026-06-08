# VantaUI CSS

> A dark, angular, military-telemetry **tactical HUD** design system as a reusable CSS library. Semantic-first like [BeerCSS](https://www.beercss.com): write proper HTML, get a tactical UI. Add a few `vui-` classes to make it beautiful. Responsive, OKLCH, zero-dependency, framework-agnostic.

![VantaUI CSS preview](docs/preview.png)

The vibe: cold near-black surfaces, sharp **chamfered** corners, a single **electric cyan** signal color that glows, uppercase machine-cut type, telemetry everywhere. Color is rare and always means something.

---

## Install

**CDN — one line, nothing to build:**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vui-css/dist/vantaui.min.css" />
<!-- icons (line glyphs that read as HUD marks) -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3/dist/tabler-icons.min.css"
/>
```

**npm:**

```bash
npm i vui-css
```

```js
import 'vui-css'; // the stylesheet
import {init} from 'vui-css/js'; // optional behaviours (tabs, animated meters, clock)
init();
```

Fonts (Chakra Petch · Rajdhani · Share Tech Mono) load automatically via an `@import` inside the stylesheet — no extra step.

---

## The big idea

Add **`class="vui"`** to a root element (usually `<body>`). Inside it, plain semantic HTML is styled for you — **no classes required**:

```html
<body class="vui">
  <h1>Command Center</h1>
  <article>
    <header><span class="vui-panel__eyebrow">Diagnostics</span></header>
    <p>This is a chamfered panel. The header drew its own divider.</p>
    <footer><button type="submit">Authorize</button></footer>
  </article>

  <button>Override</button>
  <!-- outline button -->
  <button class="vui-btn--primary">Engage</button>

  <label><input type="checkbox" role="switch" checked /> Active camo</label>
  <meter min="0" max="100" low="30" high="70" optimum="100" value="86"></meter>
</body>
```

- **Semantic styles are scoped to `.vui`** and authored at zero specificity (`:where()`), so your app's own classes always win.
- **`vui-*` classes work anywhere**, with or without the `.vui` root, for precise control.
- Modern CSS does the smart bits: **`:has()`** detects icon-only buttons and panel headers, **cascade layers** keep your styles on top, **`:checked` / `appearance`** draw the form controls.

> Prefer not to restyle bare elements? Skip the `.vui` root and use only the `vui-*` classes — nothing global changes except the design tokens.

---

## Vue 3

```js
import {createApp} from 'vue';
import VantaUI from 'vui-css/vue'; // imports the CSS, adds `.vui` to <body>, boots behaviours
import App from './App.vue';

createApp(App).use(VantaUI).mount('#app');
// options: app.use(VantaUI, { behaviours: false, bodyClass: false, root: el })
```

## Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vui-css/nuxt'],
  VantaUI: {behaviours: true, bodyClass: true}, // all default true
});
```

The module registers the stylesheet, adds `.vui` to `<body>` app-wide, and (client-side) boots the optional behaviours.

---

## What you get from bare HTML

| Write this | You get |
| --- | --- | --- |
| `<h1>…<h6>` | Uppercase, tracked display headings |
| `<button>` | Chamfered outline button (`type="submit"` → filled primary) |
| `<button><i class="ti ti-x"></i></button>` | Square icon button (detected via `:has`) |
| `<a>` `<code>` `<kbd>` `<mark>` `<pre>` `<blockquote>` `<hr>` | Tactical inline + block styles |
| `<article>` | Chamfered panel; `<header>`/`<footer>` auto-divide |
| `<input>` `<textarea>` `<select>` | Inset terminal fields with focus glow |
| `<input type="checkbox | radio">` | Notched / round emissive marks |
| `<input type="checkbox" role="switch">` | Angular toggle switch |
| `<input type="range">` | Tactical slider |
| `<meter>` `<progress>` | Telemetry bars (meter colors by threshold) |
| `<table>` | Mono data grid, eyebrow headers, cyan row hover |
| `<details><summary>` | Zero-JS chamfered disclosure |
| `<dialog>` | Chamfered modal with scrim backdrop |
| `[role="status"]` / `[role="alert"]` | Info / threat alert with accent rail + glyph |
| `[role="tablist"]` / `[role="tab"]` | Tab strip (state via the JS helper or your framework) |

---

## Components (class layer)

Every component is `vui-` prefixed. Tones are set with a `--*` modifier class **or** a `[data-tone]` attribute on the semantic element.

- **Buttons** `vui-btn` · `--primary --secondary --ghost` · `--sm --lg --block` · tones `--amber --danger --secure` · `vui-iconbtn` (`--sm --lg --active`)
- **Panels** `vui-panel` · `--raised --inset --flat --glow --notch --brackets` · `vui-panel__head/__eyebrow/__aside/__body/__foot`
- **Badges** `vui-badge` · `--cyan --amber --red --green --neutral` · `--solid --dot`
- **Forms** `vui-field` · `vui-input` · `vui-select` · `vui-input-wrap` (auto-pads a leading icon via `:has`) · `vui-check` · `vui-switch`
- **Meters** `vui-meter` (`style="--value:72"`) · `--cyan --amber --red --green` · `--segmented` · native `<meter>` / `<progress>`
- **Gauge** `vui-gauge` (`style="--value:72"`, pure CSS conic ring) · `--sm --lg` · tones
- **Alerts** `vui-alert` · `--info --warn --threat --secure`
- **Tabs** `vui-tabs` / `vui-tab` (`--active`, `vui-tab__count`) · `vui-details`
- **Tables** `vui-table` · wrap in `vui-table-scroll` for mobile overflow
- **Overlay** `vui-dialog` · `vui-tooltip[data-tip]` · `vui-divider[data-label]` · `vui-kv` · `vui-stat`
- **App shell** `vui-app` · `vui-rail` · `vui-topbar` · `vui-stage` (rail collapses to a bottom bar on phones, vertical rail from `768px`)

Meter/gauge values can render **with zero JS** — leave the value element empty and a CSS counter prints `--value`. The optional JS helper animates them from 0.

---

## Layout & responsive

Mobile-first breakpoints: **s** 36rem · **m** 48rem · **l** 64rem · **xl** 80rem.

```html
<!-- 12-col grid: stacks on phones, columns from each breakpoint up -->
<div class="vui-grid">
  <div class="vui-s12 vui-m6 vui-l4">…</div>
  <div class="vui-s12 vui-m6 vui-l8">…</div>
</div>

<!-- zero-config auto grid (set the min track) -->
<div class="vui-autogrid" style="--vui-min: 16rem">… cards …</div>

<!-- container, flex helpers, show/hide -->
<div class="vui-container">…</div>
<div class="vui-cluster">…</div>
<!-- wrapping row with gap -->
<aside class="vui-until-m">phones only</aside>
<aside class="vui-from-m">tablet and up</aside>
```

Plus utilities: `vui-flex/grid-d`, `vui-gap-0…8`, `vui-p-/pi-/pb-`, `vui-m-/mb-/mbe-`, `vui-text-*`, `vui-font-*`, `vui-text-{cyan…}`, `vui-bg-*`, `vui-glow-*`, and more. Typography is fluid (`clamp()`); nothing is tied to a breakpoint.

---

## Theming

Everything is CSS custom properties — override them anywhere (they cascade):

```css
:root {
  --accent: oklch(84.6% 0.133 212.1); /* the signal color */
  --bevel-md: 14px; /* deeper chamfers */
  --container-max: 90rem;
}
```

Colors are **OKLCH** (the `dist` build targets engines that support it; the `src/` tokens keep hex fallbacks for older targets if you build your own).

---

## Develop

```bash
npm run build     # bundle src/ → dist/vantaui.css + dist/vantaui.min.css (LightningCSS)
npm run palette   # regenerate the OKLCH palette from the source hex values
```

Source lives in `src/` (tokens → base → layout → components → utilities), wired into cascade layers by `src/vantaui.css`. Open `docs/index.html` to see everything.

## Browser support

Targets evergreen browsers from ~2023: requires `:has()`, cascade layers, `color-mix()`, `oklch()`, `mask`, and `conic-gradient` — Chrome/Edge 111+, Firefox 121+, Safari 16.4+.

## License

MIT. An original interpretation of a tactical-HUD look — no trademarked marks or character likenesses. For fan / personal projects.
