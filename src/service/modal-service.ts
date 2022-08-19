import {
  App,
  AppContext,
  ComponentInternalInstance,
  createVNode,
  render,
  VNode
} from "vue";

import ModalComponent from "../components/modal.vue";
import {
  ConfirmOption,
  CONFIRM_OPTION_KEYS,
  INVALID_OPTIONS,
  Modal,
  ModalOption,
  ModalRef,
  MODAL_DELAY,
  MODAL_OPTION_KEYS
} from "../models/model";

let _context: AppContext;
const currentModalRefs: ModalRef[] = [];

function confirm(
  options?: ConfirmOption,
  el: HTMLElement = document.body
): Promise<boolean> {
  if (!isConfirmOption(options)) {
    throw new Error(INVALID_OPTIONS);
  }
  return new Promise((resolve, reject) => {
    const props = {
      ...options,
      resolve,
      reject,
    };
    renderModal(props, el, options);
  });
}

function open(options: ModalOption, el: HTMLElement = document.body): void {
  if (!isCommonModalOption(options)) {
    throw new Error(INVALID_OPTIONS);
  }
  renderModal({ ...options, full: true }, el, options);
}

function close() {
  const modalRef = currentModalRefs.pop();
  modalRef?.close();
}

function renderModal(
  props: Record<string, unknown>,
  el: HTMLElement,
  config: ModalOption | ConfirmOption
) {
  const host = document.createElement("span");
  el.appendChild(host);
  let vnode: VNode | undefined = createVNode(ModalComponent, props);
  vnode.appContext = _context;
  const modalRef: ModalRef = {
    closed: false,
    host,
    config,
    close() {
      if (this.closed) {
        return;
      }
      this.closed = true;
      const component = (vnode as VNode)
        ?.component as ComponentInternalInstance;
      component.data.out = true;
      setTimeout(() => {
        const found = currentModalRefs.find(
          (m) => !m.config?.backgroundScrolling
        );
        if (found) {
          component.data.disableScrolling = false;
        }
        render(null, host);
        vnode = undefined;
        this.host.remove();
      }, MODAL_DELAY);
    },
  };
  currentModalRefs.push(modalRef);
  render(vnode, host);
}

function isConfirmOption(
  options: ConfirmOption = {}
): options is ConfirmOption {
  return isSubArray(CONFIRM_OPTION_KEYS, Object.keys(options));
}

function isCommonModalOption(options: ModalOption): options is ModalOption {
  if (!options?.content) {
    return false;
  }
  return isSubArray(MODAL_OPTION_KEYS, Object.keys(options));
}

function isSubArray(main: unknown[], sub: unknown[]): boolean {
  return sub.every((val) => main.includes(val));
}

export function setCurrentAppContext(context: AppContext) {
  _context = context;
}

export const modal: Modal = {
  confirm,
  open,
  close,
};

export default {
  install(app: App): void {
    _context = app._context;
    app.config.globalProperties.$vbsModal = modal;
  },
};
