/* ============================================================
   VantaUI — Nuxt 3 module.
   nuxt.config.ts:
     export default defineNuxtConfig({
       modules: ["vui-css/nuxt"],
       VantaUI: { behaviours: true, bodyClass: true }
     })

   Registers the stylesheet, adds `.vui` to <body> (so semantic HTML
   is styled app-wide), and — client-side — boots the optional
   behaviours (tabs, animated meters, clock).
   ============================================================ */

import {defineNuxtModule, addPluginTemplate} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'vui-css',
    configKey: 'VantaUI',
    compatibility: {nuxt: '>=3.0.0'},
  },
  defaults: {
    css: true,
    behaviours: true,
    bodyClass: true,
  },
  setup(options, nuxt) {
    if (options.css) {
      nuxt.options.css.push('vui-css/dist/vantaui.min.css');
    }

    if (options.bodyClass) {
      const head = (nuxt.options.app.head ||= {});
      const bodyAttrs = (head.bodyAttrs ||= {});
      bodyAttrs.class = `${bodyAttrs.class ? bodyAttrs.class + ' ' : ''}VantaUI`;
    }

    if (options.behaviours) {
      addPluginTemplate({
        filename: 'vui-behaviours.client.mjs',
        mode: 'client',
        getContents: () =>
          [
            'import { init } from "vui-css/js";',
            'export default defineNuxtPlugin((nuxtApp) => {',
            "  nuxtApp.hook('app:mounted', () => init());",
            "  nuxtApp.hook('page:finish', () => init());",
            '});',
          ].join('\n'),
      });
    }
  },
});
