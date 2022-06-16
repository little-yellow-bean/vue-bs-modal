import {
  App,
  ComponentInternalInstance,
  createVNode,
  render,
  VNode,
} from "vue";
import ModalComponent from "./modal.vue";
import {
  ConfirmOption,
  Modal,
  ModalOption,
  ModalRef,
  ModalReturn,
  MODAL_DELAY,
} from "./model";

function confirm(
  options?: ConfirmOption,
  el: HTMLElement = document.body
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const props = {
      ...options,
      resolve,
      reject,
    };
    renderModal(props, el);
  });
}

function show(
  options: ModalOption,
  el: HTMLElement = document.body
): Promise<ModalReturn> {
  return new Promise((resolve, reject) => {
    const props = {
      ...options,
      resolve,
      reject,
    };
    renderModal(props, el);
  });
}

function renderModal(props: Record<string, unknown>, el: HTMLElement) {
  let vnode: VNode | undefined = createVNode(ModalComponent, props);
  const modalRef: ModalRef = {
    close() {
      const component = (vnode as VNode)
        ?.component as ComponentInternalInstance;
      component.data.out = true;
      setTimeout(() => {
        render(null, el);
        vnode = undefined;
      }, MODAL_DELAY);
    },
  };
  vnode.props = { ...vnode.props, modalRef };
  render(vnode, el);
}

export const modal: Modal = {
  confirm,
  show,
};

export default {
  install(app: App) {
    app.config.globalProperties.$modal = modal;
  },
};
