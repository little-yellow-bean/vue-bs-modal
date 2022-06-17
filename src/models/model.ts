import { Component, VNode } from "vue";

export const MODAL_DELAY = 500;

export const CONFIRM_OPTION_KEYS = [
  "title",
  "message",
  "icon",
  "center",
  "leftBtnText",
  "rightBtnText",
];

export const MODAL_OPTION_KEYS = [
  "title",
  "content",
  "leftBtnText",
  "rightBtnText",
  "size",
  "contentProps",
  "center",
  "displayHeader",
  "displayFooter",
  "displayCloseBtn",
  "displayLeftBtn",
  "displayRightBtn",
];

export const INVALID_OPTIONS = "Invalid Options";

export interface ConfirmOption {
  title?: string;
  message?: string;
  icon?: string;
  center?: boolean;
  leftBtnText?: string;
  rightBtnText?: string;
}

export interface ModalOption {
  title: string;
  content: Component;
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
}

export interface ModalRef {
  close: () => void;
}

export interface ContentRef {
  clear: () => void;
  internalComponentVNode: VNode;
}

export interface ModalReturn {
  confirmed: boolean;
  modalRef: ModalRef;
  data?: Record<string, unknown>;
}

export interface Modal {
  confirm: (options?: ConfirmOption, el?: HTMLElement) => Promise<boolean>;
  show: (options: ModalOption, el?: HTMLElement) => Promise<ModalReturn>;
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
