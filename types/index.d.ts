import { App, Component } from "vue";

export declare interface ConfirmOption {
  title?: string;
  message?: string;
  icon?: string;
  center?: boolean;
  leftBtnText?: string;
  rightBtnText?: string;
  backgroundScrolling?: boolean;
  staticBackdrop?: boolean;
  displayCloseBtn?: boolean;
}

export declare interface ModalOption {
  content: Component | string;
  contentProps?: Record<string, unknown>;
  contentEmits?: Record<string, unknown>;
  size?: ModalSize;
  center?: boolean;
  backgroundScrolling?: boolean;
  staticBackdrop?: boolean;
}

export declare interface Modal {
  readonly confirm: (
    options?: ConfirmOption,
    el?: HTMLElement
  ) => Promise<boolean>;
  readonly open: (options: ModalOption, el?: HTMLElement) => void;
  readonly close: () => void;
}

declare interface ModalPlugin {
  install: (app: App) => void;
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
    $vbsModal: Modal;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $vbsModal: Modal;
  }
}

declare const _default: ModalPlugin;

export default _default;
