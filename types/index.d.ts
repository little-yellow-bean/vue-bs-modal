import { Component, App } from "vue";

export declare interface ConfirmOption {
  title?: string;
  message?: string;
  icon?: string;
  center?: boolean;
  leftBtnText?: string;
  rightBtnText?: string;
  backgroundScrolling?: boolean;
}

export declare interface ModalOption {
  title: string;
  content: Component | string;
  leftBtnText?: string;
  rightBtnText?: string;
  size?: ModalSize;
  contentProps?: Record<string, unknown>;
  center?: boolean;
  displayHeader?: boolean;
  displayFooter?: boolean;
  displayCloseBtn?: boolean;
  displayLeftBtn?: boolean;
  displayRightBtn?: boolean;
  autoCloseOnRightBtnClick?: boolean;
  autoCloseOnLeftBtnClick?: boolean;
  backgroundScrolling?: boolean;
}

export declare interface ModalRef {
  readonly close: () => void;
}

export declare interface ModalReturn {
  confirmed: boolean;
  modalRef: ModalRef;
  data?: Record<string, unknown>;
}
export declare interface Modal {
  readonly confirm: (
    options?: ConfirmOption,
    el?: HTMLElement
  ) => Promise<boolean>;
  readonly show: (
    options: ModalOption,
    el?: HTMLElement
  ) => Promise<ModalReturn>;
}

export declare enum ModalSize {
  SMALL = "modal-sm",
  LARGE = "modal-lg",
  XLARGE = "modal-xl",
  FULL_SCREEN = "modal-fullscreen",
  FULL_SCREEN_SM = "modal-fullscreen-sm-down",
  FULL_SCREEN_MD = "modal-fullscreen-md-down",
  FULL_SCREEN_LG = "modal-fullscreen-lg-down",
  FULL_SCREEN_XL = "modal-fullscreen-xl-down",
  FULL_SCREEN_XXL = "modal-fullscreen-xxl-down",
}

declare module "vue/types/vue" {
  interface Vue {
    $modal: Modal;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $modal: Modal;
  }
}

declare const _default: {
  install: (app: App) => void;
};

export default _default;
