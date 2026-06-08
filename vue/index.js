/* ============================================================
   BatOS — Vue 3 plugin.
   Usage:
     import { createApp } from "vue";
     import BatOS from "batos-css/vue";
     createApp(App).use(BatOS).mount("#app");

   It imports the stylesheet, marks the document root with `.batos`
   (so semantic HTML is styled), and boots the optional behaviours
   (tabs, animated meters, clock). Options:
     app.use(BatOS, { root: el, behaviours: false, bodyClass: false })
   ============================================================ */

import "../dist/batos.min.css";
import BatOSBehaviours from "../js/batos.js";

const plugin = {
  install(app, options = {}) {
    if (typeof document === "undefined") return; // SSR: nothing to do server-side
    const { root, behaviours = true, bodyClass = true } = options;
    if (bodyClass) (root || document.body).classList.add("batos");
    if (behaviours) BatOSBehaviours.init(root || document);
    app.config.globalProperties.$batos = BatOSBehaviours;
  },
};

export default plugin;
export { BatOSBehaviours as BatOS };
