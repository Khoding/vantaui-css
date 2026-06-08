# BatOS CSS

> A dark, angular, military-telemetry **tactical HUD** design system as a
> reusable CSS library. Semantic-first like [BeerCSS](https://www.beercss.com):
> write proper HTML, get a tactical UI. Add a few `batos-` classes to make it
> beautiful. Responsive, OKLCH, zero-dependency, framework-agnostic.

![BatOS CSS preview](docs/preview.png)

The vibe: cold near-black surfaces, sharp **chamfered** corners, a single
**electric cyan** signal color that glows, uppercase machine-cut type, telemetry
everywhere. Color is rare and always means something.

---

## Install

**CDN — one line, nothing to build:**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/batos-css/dist/batos.min.css" />
<!-- icons (line glyphs that read as HUD marks) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3/dist/tabler-icons.min.css" />
```

**npm:**

```bash
npm i batos-css
```

```js
import "batos-css";            // the stylesheet
import { init } from "batos-css/js"; // optional behaviours (tabs, animated meters, clock)
init();
```

Fonts (Chakra Petch · Rajdhani · Share Tech Mono) load automatically via an
`@import` inside the stylesheet — no extra step.

---

## The big idea

Add **`class="batos"`** to a root element (usually `<body>`). Inside it, plain
semantic HTML is styled for you — **no classes required**:

```html
<body class="batos">
  <h1>Command Center</h1>
  <article>
    <header><span class="batos-panel__eyebrow">Diagnostics</span></header>
    <p>This is a chamfered panel. The header drew its own divider.</p>
    <footer><button type="submit">Authorize</button></footer>
  </article>

  <button>Override</button>            <!-- outline button -->
  <button class="batos-btn--primary">Engage</button>

  <label><input type="checkbox" role="switch" checked> Active camo</label>
  <meter min="0" max="100" low="30" high="70" optimum="100" value="86"></meter>
</body>
```

- **Semantic styles are scoped to `.batos`** and authored at zero specificity
  (`:where()`), so your app's own classes always win.
- **`batos-*` classes work anywhere**, with or without the `.batos` root, for
  precise control.
- Modern CSS does the smart bits: **`:has()`** detects icon-only buttons and
  panel headers, **cascade layers** keep your styles on top, **`:checked` /
  `appearance`** draw the form controls.

> Prefer not to restyle bare elements? Skip the `.batos` root and use only the
> `batos-*` classes — nothing global changes except the design tokens.

---

## Vue 3

```js
import { createApp } from "vue";
import BatOS from "batos-css/vue";   // imports the CSS, adds `.batos` to <body>, boots behaviours
import App from "./App.vue";

createApp(App).use(BatOS).mount("#app");
// options: app.use(BatOS, { behaviours: false, bodyClass: false, root: el })
```

## Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["batos-css/nuxt"],
  batos: { behaviours: true, bodyClass: true }, // all default true
});
```

The module registers the stylesheet, adds `.batos` to `<body>` app-wide, and
(client-side) boots the optional behaviours.

---

## What you get from bare HTML

| Write this | You get |
| --- | --- |
| `<h1>…<h6>` | Uppercase, tracked display headings |
| `<button>` | Chamfered outline button (`type="submit"` → filled primary) |
| `<button><i class="ti ti-x"></i></button>` | Square icon button (detected via `:has`) |
| `<a>` `<code>` `<kbd>` `<mark>` `<pre>` `<blockquote>` `<hr>` | Tactical inline + block styles |
| `<article>` | Chamfered panel; `<header>`/`<footer>` auto-divide |
| `<input>` `<textarea>` `<select>` | Inset terminal fields with focus glow |
| `<input type="checkbox|radio">` | Notched / round emissive marks |
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

Every component is `batos-` prefixed. Tones are set with a `--*` modifier class
**or** a `[data-tone]` attribute on the semantic element.

- **Buttons** `batos-btn` · `--primary --secondary --ghost` · `--sm --lg --block`
  · tones `--amber --danger --secure` · `batos-iconbtn` (`--sm --lg --active`)
- **Panels** `batos-panel` · `--raised --inset --flat --glow --notch --brackets`
  · `batos-panel__head/__eyebrow/__aside/__body/__foot`
- **Badges** `batos-badge` · `--cyan --amber --red --green --neutral` · `--solid --dot`
- **Forms** `batos-field` · `batos-input` · `batos-select` · `batos-input-wrap`
  (auto-pads a leading icon via `:has`) · `batos-check` · `batos-switch`
- **Meters** `batos-meter` (`style="--value:72"`) · `--cyan --amber --red --green`
  · `--segmented` · native `<meter>` / `<progress>`
- **Gauge** `batos-gauge` (`style="--value:72"`, pure CSS conic ring) · `--sm --lg` · tones
- **Alerts** `batos-alert` · `--info --warn --threat --secure`
- **Tabs** `batos-tabs` / `batos-tab` (`--active`, `batos-tab__count`) · `batos-details`
- **Tables** `batos-table` · wrap in `batos-table-scroll` for mobile overflow
- **Overlay** `batos-dialog` · `batos-tooltip[data-tip]` · `batos-divider[data-label]`
  · `batos-kv` · `batos-stat`
- **App shell** `batos-app` · `batos-rail` · `batos-topbar` · `batos-stage`
  (rail collapses to a bottom bar on phones, vertical rail from `768px`)

Meter/gauge values can render **with zero JS** — leave the value element empty
and a CSS counter prints `--value`. The optional JS helper animates them from 0.

---

## Layout & responsive

Mobile-first breakpoints: **s** 36rem · **m** 48rem · **l** 64rem · **xl** 80rem.

```html
<!-- 12-col grid: stacks on phones, columns from each breakpoint up -->
<div class="batos-grid">
  <div class="batos-s12 batos-m6 batos-l4">…</div>
  <div class="batos-s12 batos-m6 batos-l8">…</div>
</div>

<!-- zero-config auto grid (set the min track) -->
<div class="batos-autogrid" style="--batos-min: 16rem"> … cards … </div>

<!-- container, flex helpers, show/hide -->
<div class="batos-container">…</div>
<div class="batos-cluster">…</div>      <!-- wrapping row with gap -->
<aside class="batos-until-m">phones only</aside>
<aside class="batos-from-m">tablet and up</aside>
```

Plus utilities: `batos-flex/grid-d`, `batos-gap-0…8`, `batos-p-/pi-/pb-`,
`batos-m-/mb-/mbe-`, `batos-text-*`, `batos-font-*`, `batos-text-{cyan…}`,
`batos-bg-*`, `batos-glow-*`, and more. Typography is fluid (`clamp()`); nothing
is tied to a breakpoint.

---

## Theming

Everything is CSS custom properties — override them anywhere (they cascade):

```css
:root {
  --accent: oklch(84.6% 0.133 212.1); /* the signal color */
  --bevel-md: 14px;                   /* deeper chamfers */
  --container-max: 90rem;
}
```

Colors are **OKLCH** (the `dist` build targets engines that support it; the
`src/` tokens keep hex fallbacks for older targets if you build your own).

---

## Develop

```bash
npm run build     # bundle src/ → dist/batos.css + dist/batos.min.css (LightningCSS)
npm run palette   # regenerate the OKLCH palette from the source hex values
```

Source lives in `src/` (tokens → base → layout → components → utilities), wired
into cascade layers by `src/batos.css`. Open `docs/index.html` to see everything.

## Browser support

Targets evergreen browsers from ~2023: requires `:has()`, cascade layers,
`color-mix()`, `oklch()`, `mask`, and `conic-gradient` — Chrome/Edge 111+,
Firefox 121+, Safari 16.4+.

## License

MIT. An original interpretation of a tactical-HUD look — no trademarked marks or
character likenesses. For fan / personal projects.
