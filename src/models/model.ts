import { Component } from "vue";


export const CONFIRM_OPTION_KEYS = [
  "title",
  "message",
  "icon",
  "center",
  "leftBtnText",
  "rightBtnText",
  "backgroundScrolling",
  "staticBackdrop",
];

export const MODAL_OPTION_KEYS = [
  "content",
  "contentProps",
  "size",
  "center",
  "backgroundScrolling",
  "staticBackdrop",
];

export interface ConfirmOption {
  title?: string;
  message?: string;
  icon?: string;
  center?: boolean;
  leftBtnText?: string;
  rightBtnText?: string;
  backgroundScrolling?: boolean;
  staticBackdrop?: boolean;
}

export interface ModalOption {
  content: Component | string;
  contentProps?: Record<string, unknown>;
  size?: ModalSize;
  center?: boolean;
  backgroundScrolling?: boolean;
  staticBackdrop?: boolean;
}

export interface ModalRef {
  host: HTMLElement;
  closed: boolean;
  readonly close: () => void;
}

export interface Modal {
  readonly confirm: (
    options?: ConfirmOption,
    el?: HTMLElement
  ) => Promise<boolean>;
  readonly open: (options: ModalOption, el?: HTMLElement) => void;
  readonly close: () => void;
}

export enum ModalSize {
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
