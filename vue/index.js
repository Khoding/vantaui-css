/* ============================================================
   VantaUI — Vue 3 plugin.
   Usage:
     import { createApp } from "vue";
     import VantaUI from "vui-css/vue";
     createApp(App).use(VantaUI).mount("#app");

   It imports the stylesheet, marks the document root with `.vui`
   (so semantic HTML is styled), and boots the optional behaviours
   (tabs, animated meters, clock). Options:
     app.use(VantaUI, { root: el, behaviours: false, bodyClass: false })
   ============================================================ */

import '../dist/vantaui.min.css';
import VantaUIBehaviours from '../js/vantaui.js';

const plugin = {
  install(app, options = {}) {
    if (typeof document === 'undefined') return; // SSR: nothing to do server-side
    const {root, behaviours = true, bodyClass = true} = options;
    if (bodyClass) (root || document.body).classList.add('VantaUI');
    if (behaviours) VantaUIBehaviours.init(root || document);
    app.config.globalProperties.$VantaUI = VantaUIBehaviours;
  },
};

export default plugin;
export {VantaUIBehaviours as VantaUI};
