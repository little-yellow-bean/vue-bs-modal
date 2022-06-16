import Vue, { App, VNode } from 'vue'
import { Modal } from "./components/modal/model";

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
  interface Window { Vue: App; }
}


declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
      $modal: Modal;
    }
  }