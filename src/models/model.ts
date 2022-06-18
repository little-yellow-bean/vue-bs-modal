import { Component, VNode } from "vue";

export const MODAL_DELAY = 500;

export const CONFIRM_OPTION_KEYS = [
  "title",
  "message",
  "icon",
  "center",
  "leftBtnText",
  "rightBtnText",
  "backgroundScrolling",
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
  "autoCloseOnRightBtnClick",
  "autoCloseOnLeftBtnClick",
  "backgroundScrolling",
  "leftBtnHandler",
  "rightBtnHandler",
  "resolveDataHander",
];

export const INVALID_OPTIONS = "Invalid Options";

export interface ConfirmOption {
  title?: string;
  message?: string;
  icon?: string;
  center?: boolean;
  leftBtnText?: string;
  rightBtnText?: string;
  backgroundScrolling?: boolean;
}

export interface ModalOption {
  title: string;
  content: Component | string;
  leftBtnText?: string;
  rightBtnText?: string;
  leftBtnHandler?: string;
  rightBtnHandler?: string;
  resolveDataHander?: string;
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

export interface ModalRef {
  closed: boolean;
  readonly close: () => void;
}

export interface ContentRef {
  readonly clear: () => void;
  readonly internalComponentVNode: VNode;
}

export interface ModalReturn {
  action: ModalAction;
  modalRef: ModalRef;
  data?: any;
}

export enum ModalAction {
  LEFT_BTN_CLICK = "LEFT_BTN_CLICK",
  RIGHT_BTN_CLICK = "RIGHT_BTN_CLICK",
  CLOSE_BTN_CLICK = "CLOSE_BTN_CLICK",
  BACKDROP_CLICK = "BACKDROP_CLICK",
}

export interface Modal {
  readonly confirm: (
    options?: ConfirmOption,
    el?: HTMLElement
  ) => Promise<boolean>;
  readonly show: (
    options: ModalOption,
    el?: HTMLElement
  ) => Promise<ModalReturn>;
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
