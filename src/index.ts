import { App } from "vue";
import plugin, { modal, setCurrentAppContext } from "./service/modal-service";

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(plugin);
}

export { ModalSize, ModalAction } from "./models/model";

export default {
  install(app: App) {
    setCurrentAppContext(app._context);
    app.config.globalProperties.$modal = modal;
  },
};
