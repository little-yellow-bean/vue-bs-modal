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
  INVALID_OPTIONS,
  Modal,
  ModalOption,
  ModalRef,
  ModalReturn,
  MODAL_DELAY,
  MODAL_OPTION_KEYS,
} from "../models/model";

let _context: AppContext;
let _currentModalRef: ModalRef | undefined;

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

function show(
  options: ModalOption,
  el: HTMLElement = document.body
): Promise<ModalReturn> {
  if (!isCommonModalOption(options)) {
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

function renderModal(props: Record<string, unknown>, el: HTMLElement) {
  if (_currentModalRef) {
    _currentModalRef.close();
    setTimeout(() => _renderModal(props, el), MODAL_DELAY);
  } else {
    _renderModal(props, el);
  }
}

function _renderModal(props: Record<string, unknown>, el: HTMLElement) {
  let vnode: VNode | undefined = createVNode(ModalComponent, props);
  vnode.appContext = _context;
  const modalRef: ModalRef = {
    close() {
      const component = (vnode as VNode)
        ?.component as ComponentInternalInstance;
      component.data.out = true;
      setTimeout(() => {
        _currentModalRef = undefined;
        render(null, el);
        vnode = undefined;
      }, MODAL_DELAY);
    },
  };
  _currentModalRef = modalRef;
  vnode.props = {
    ...vnode.props,
    context: _context,
    modalRef: { ...modalRef },
  };
  render(vnode, el);
}

function isConfirmOption(
  options: ConfirmOption = {}
): options is ConfirmOption {
  return isSubArray(CONFIRM_OPTION_KEYS, Object.keys(options));
}

function isCommonModalOption(options: ModalOption): options is ModalOption {
  if (!options?.content || !options?.title) {
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
  show,
};

export default {
  install(app: App) {
    _context = app._context;
    app.config.globalProperties.$modal = modal;
  },
};
