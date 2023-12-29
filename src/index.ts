import { App } from "vue";
import plugin, { modal, setCurrentAppContext } from "./service/modal-service";

if (typeof window !== "undefined" && window.Vue) {
  window.VbsModal = plugin;
}

export { ModalSize } from "./models/model";

export default {
  install(app: App): void {
    setCurrentAppContext(app._context);
    app.config.globalProperties.$vbsModal = modal;
    app.provide('modal', modal);
  },
};
