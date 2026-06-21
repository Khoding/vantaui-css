# VantaUI — contributor guide for AI assistants

VantaUI is a semantic-first, dark "tactical HUD" CSS library (BeerCSS-style: write plain semantic HTML inside `.vui`, get a styled UI; one short helper word to deviate). Source lives in `src/`, builds to `dist/`, optional behaviours in `js/`, framework adapters in `vue/` and `nuxt/`, docs + LLM files in `docs/`.

## The rule that matters most: docs are part of the change, not a follow-up

The library is documented for both humans and LLMs in `docs/`. These files are **hand-curated prose** — they do not regenerate from source. They drift the moment code changes without them (a third of the library once shipped undocumented this way). So:

> **Whenever you add, rename, remove, or meaningfully change a component, helper class, design token, JS behaviour, or public option, update the matching doc files in the SAME change** — never "later".

What "update the docs" means, concretely:

1. **Edit the right topic file** in `docs/` (see the map below).
2. **Mirror the edit in `docs/llms-full.txt`** — it is the single-file superset of every topic file and must stay in sync.
3. **If you added a brand-new component/topic**, also add a one-line link to it in the hub (`docs/llms.txt`) under "Reference".
4. **Bump the version stamp.** Every file in `docs/` carries `Authoritative as of vX.Y.Z`, and `llms.txt` / `llms-full.txt` also show the install tag. When `package.json` `version` changes, update those stamps to match.
5. Keep the voice: terse, example-driven, accurate to the actual selectors/classes in `src/`. Document the real trigger (semantic element or class), helper/modifier words, and any `--vui-*` / `--value` knobs.

If you are unsure whether a change is "doc-worthy": if it changes what a consumer would write in their HTML/CSS/JS, it is.

## Source → docs map

| You changed in `src/` (or `js/`) … | Update this topic file (+ `llms-full.txt`) |
| --- | --- |
| `layout/layout.css`, `layout/prose.css`, `utilities/utilities.css`, `base/primitives.css` | `docs/llms-layout.txt` |
| `components/{header,footer,navigation,overlay,menu,tabs,pagination,toolbar}.css`, `components/appshell.css` | `docs/llms-navigation.txt` |
| `components/{button,forms}.css` | `docs/llms-forms.txt` |
| `components/{panel,table,badge,lists,avatar,timeline,stepper,tree,carousel,rating,segmented}.css`, the `.kv`/`.stat` helpers in `overlay.css` | `docs/llms-data.txt` |
| `components/{alert,toast,meter,gauge,spinner,skeleton,empty-state}.css`, the status dot in `primitives.css` | `docs/llms-feedback.txt` |
| `tokens/{colors,typography,spacing,effects,fonts}.css` | `docs/llms-theming.txt` |
| `js/vantaui.js`, `vue/`, `nuxt/` | `docs/llms-js.txt` |

(`overlay.css` and `primitives.css` are split across files — overlay's modal/drawer pieces are navigation, its `.kv`/`.stat` are data; primitives' type roles/plates are layout, its status dot is feedback. Touch whichever topic the specific feature belongs to.)

The human docs site is `docs/index.html` (+ `docs/playground.css`, `docs/js/vantaui.js`, `docs/gallery.js`). If a change affects the live demos there, update them too.

## House style (CSS)

This repo follows the global CSS conventions in `~/.claude/CLAUDE.md` (Vanilla CSS, LightningCSS, OKLCH colors, logical properties, longhand, `clamp()` typography, mobile-first `min-width`, attribute selectors, native nesting). In addition, VantaUI-specific invariants:

- **Zero specificity:** author component styles inside `:where(.vui …)` so a consumer's unlayered classes always win. Never rely on `!important`.
- **Cascade layers:** everything is imported into `vui.{tokens,reset,base,layout,components,utilities}` (order set in `src/vantaui.css`). Keep new files in the correct layer; import order within `components` matters for `:where()` ties (see the comments in `src/vantaui.css`).
- **Prefix discipline:** bare semantic elements get NO prefix; free-floating layout/utility/primitive helpers use the `vui-` prefix. Component helper words (e.g. `glow`, `danger`) are unprefixed and element-scoped.
- **Tokens drive everything:** use the `--*` custom properties (colors, spacing, bevels, fonts) rather than hard-coded values, so theming works by overriding tokens.
- **Overflow philosophy:** contain at the source (`min-inline-size:0`, clipped house-shapes), let genuine misuse scroll visibly; never `overflow: clip` destructively.
- Each `src/` file opens with a prose header documenting its API — keep that header accurate when you change the file (it is the source of truth the docs are written from).

## Build & checks

- Build: `npm run build` (LightningCSS → `dist/vantaui.css` + `dist/vantaui.min.css`; also regenerates `js/vantaui.global.js` via esbuild).
- Lint: `npm run lint` (ESLint Baseline gate — run this after any CSS or JS change).
- Overflow audit: `npm run audit:overflow`. Screenshots: `npm run shot`. Palette: `npm run palette`.
- Do not edit `dist/` or `js/vantaui.global.js` by hand — both are generated.

## Cross-browser compatibility

VantaUI targets Chrome/Edge 111+, Firefox 121+, and Safari 16.4+. Chrome often ships features the others lack; the rules below keep that from becoming a silent regression.

**The Baseline gate**

`npm run lint` runs `@eslint/css` with `use-baseline: ['warn', { available: 'newly' }]` (reading the official `web-features` dataset) for CSS and `eslint-plugin-compat` for JS. It understands `@supports`, so already-guarded features stay quiet. Features knowingly shipped above Baseline are listed with their fallbacks in `eslint.config.js`; any new one warns until it gets a fallback (or is reviewed and added there). Run the gate after every CSS/JS change.

**The CSS-first rule**

Where Chrome ships a CSS feature that Firefox/Safari lack, use it inside `@supports (feature: value)`. Outside that block write a fallback that keeps the component usable. JS is only ever used to restore parity where CSS cannot do the job yet — never to replace a pure-CSS path that already works.

**`@supports not` for JS-backed fallbacks**

When a JS behaviour injects DOM to compensate for a missing CSS feature, scope its fallback styles under `@supports not (feature: value)` so Chrome never loads them. The gate (`eslint.config.js`) should list the feature in `allowSelectors` or `allowProperties` with a note pointing to the `@supports` guard.

**clip-path and borders in Firefox**

Firefox treats polygon clip-path edges as exclusive: a 1px border exactly at `y=0` or `y=100%` falls on the boundary and gets sub-pixel-clipped. The `--clip-chamfer` and `--clip-notch` tokens in `src/tokens/spacing.css` compensate by extending every flat polygon edge 1px beyond the border-box (`-1px` / `calc(100% + 1px)`). Keep this extension in place if you modify those tokens. Chrome is unaffected because `@supports (corner-shape: bevel)` removes `clip-path` on those elements entirely.

**`js/vantaui.js` is the single source of truth**

`js/vantaui.global.js` is generated from it by `npm run build`. Never hand-edit the global file — add any new behaviour to `vantaui.js`, then rebuild.
