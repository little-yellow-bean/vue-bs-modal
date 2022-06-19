import {
  App,
  AppContext,
  ComponentInternalInstance,
  createVNode,
  render,
  VNode,
} from "vue";

import ModalComponent from "../components/modal.vue";
import {
  ConfirmOption,
  CONFIRM_OPTION_KEYS,
  Modal,
  ModalOption,
  ModalRef,
  MODAL_OPTION_KEYS,
} from "../models/model";

let _context: AppContext;
const currentModalRefs: ModalRef[] = [];
export const MODAL_DELAY = 500;
export const INVALID_OPTIONS = "Invalid Options";

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
    renderModal(props, el);
  });
}

function open(options: ModalOption, el: HTMLElement = document.body): void {
  if (!isCommonModalOption(options)) {
    throw new Error(INVALID_OPTIONS);
  }
  renderModal({ ...options, full: true }, el);
}

function close() {
  const modalRef = currentModalRefs.pop();
  modalRef?.close();
}

function renderModal(props: Record<string, unknown>, el: HTMLElement) {
  const host = document.createElement("span");
  el.appendChild(host);
  let vnode: VNode | undefined = createVNode(ModalComponent, props);
  vnode.appContext = _context;
  const modalRef: ModalRef = {
    closed: false,
    host,
    close() {
      if (this.closed) {
        return;
      }
      const component = (vnode as VNode)
        ?.component as ComponentInternalInstance;
      this.closed = true;
      component.data.out = true;
      setTimeout(() => {
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
  install(app: App) {
    _context = app._context;
    app.config.globalProperties.$vbsModal = modal;
  },
};
