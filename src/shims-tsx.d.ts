import Vue, { App, VNode } from "vue";
import { Modal, ModalPlugin } from "./components/modal/model";

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Window {
    Vue: App;
    VbsModal: ModalPlugin;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $vbsModal: Modal;
  }
}
