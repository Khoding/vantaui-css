/* ============================================================
   BatOS — Nuxt 3 module.
   nuxt.config.ts:
     export default defineNuxtConfig({
       modules: ["batos-css/nuxt"],
       batos: { behaviours: true, bodyClass: true }
     })

   Registers the stylesheet, adds `.batos` to <body> (so semantic HTML
   is styled app-wide), and — client-side — boots the optional
   behaviours (tabs, animated meters, clock).
   ============================================================ */

import {defineNuxtModule, addPluginTemplate} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'batos-css',
    configKey: 'batos',
    compatibility: {nuxt: '>=3.0.0'},
  },
  defaults: {
    css: true,
    behaviours: true,
    bodyClass: true,
  },
  setup(options, nuxt) {
    if (options.css) {
      nuxt.options.css.push('batos-css/dist/batos.min.css');
    }

    if (options.bodyClass) {
      const head = (nuxt.options.app.head ||= {});
      const bodyAttrs = (head.bodyAttrs ||= {});
      bodyAttrs.class = `${bodyAttrs.class ? bodyAttrs.class + ' ' : ''}batos`;
    }

    if (options.behaviours) {
      addPluginTemplate({
        filename: 'batos-behaviours.client.mjs',
        mode: 'client',
        getContents: () =>
          [
            'import { init } from "batos-css/js";',
            'export default defineNuxtPlugin((nuxtApp) => {',
            "  nuxtApp.hook('app:mounted', () => init());",
            "  nuxtApp.hook('page:finish', () => init());",
            '});',
          ].join('\n'),
      });
    }
  },
});
