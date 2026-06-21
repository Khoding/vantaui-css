/* ============================================================
   Baseline gate. One ESLint config, two jobs:

     • CSS  — @eslint/css `use-baseline` reads the official web-features
              dataset and flags any property/selector/value/at-rule that is
              NOT "newly available" Baseline (interoperable across current
              Chrome/Firefox/Safari/Edge). Source CSS only.
     • JS   — eslint-plugin-compat checks browser APIs against the
              `browserslist` in package.json. Source module + Vue adapter.

   The allow* lists below are the curated registry of features we knowingly
   ship ABOVE Baseline. Every entry must degrade gracefully on its own (the
   feature simply does nothing extra) or sit behind an `@supports` guard with
   a real fallback. A NEW non-Baseline feature that is not listed here will
   warn: that is the signal to add a fallback (or, once reviewed and given
   one, add it here with a note). Do not add an entry without a fallback.

   Generated/copied artifacts (dist/, docs/, js/vantaui.global.js) and the
   Node build scripts are ignored. Run with `npm run lint`.
   ============================================================ */
import {defineConfig, globalIgnores} from 'eslint/config';
import css from '@eslint/css';
import compat from 'eslint-plugin-compat';

export default defineConfig([
  globalIgnores([
    'dist/',
    'docs/',
    'node_modules/',
    'scripts/',
    'js/vantaui.global.js', // generated from js/vantaui.js — see scripts/build.mjs
  ]),

  // ---- CSS: Baseline "newly available" ----
  {
    files: ['src/**/*.css'],
    language: 'css/css',
    // tolerate recoverable parse quirks (e.g. range container queries the
    // parser does not model yet) so one unusual line never blanks a whole file.
    languageOptions: {tolerant: true},
    plugins: {css},
    rules: {
      'css/use-baseline': [
        'warn',
        {
          available: 'newly',
          // Properties we use above Baseline. corner-*-shape: bevel house-shapes,
          // fallback is the clip-path path (see `@supports (corner-shape: bevel)`).
          // position-anchor: native carousel arrows, JS fallback in carousels().
          // interpolate-size: height animation behind `@supports selector(::details-content)`.
          // The rest degrade to the UA default with no layout impact.
          allowProperties: [
            'corner-start-start-shape',
            'corner-start-end-shape',
            'corner-end-start-shape',
            'corner-end-end-shape',
            'position-anchor',
            'interpolate-size',
            'overscroll-behavior-x',
            'text-size-adjust',
            'user-select',
            'accent-color',
            'resize',
          ],
          // Selectors above Baseline. scroll-* + target-current: native CSS carousel,
          // JS fallback in carousels() draws matching arrows/dots. selection: cosmetic.
          allowSelectors: [
            'scroll-button',
            'scroll-marker',
            'scroll-marker-group',
            'target-current',
            'selection',
          ],
          // text-wrap: pretty is a typographic nicety; falls back to normal wrapping.
          allowPropertyValues: {
            'text-wrap': ['pretty'],
          },
        },
      ],
    },
  },

  // ---- JS: browser-API compat against browserslist ----
  {
    ...compat.configs['flat/recommended'],
    files: ['js/vantaui.js', 'vue/**/*.js'],
  },
]);
