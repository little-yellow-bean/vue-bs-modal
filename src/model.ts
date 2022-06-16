import { Component, VNode } from "vue";

export const MODAL_DELAY = 500;

export interface ConfirmOption {
  title?: string;
  message?: string;
  icon?: string;
  center?: boolean;
}

export interface ModalOption {
  title: string;
  content: Component;
  leftBtnText?: string;
  rightBtnText?: string;
  size?: ModalSize;
  contentProps?: Record<string, unknown>;
  center?: boolean;
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
