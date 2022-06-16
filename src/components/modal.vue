<template>
  <div id="modal">
    <span>
      <div
        class="modal bs-dialog-animated"
        :class="getDialogContainerClass()"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        @click="onBackdropClick($event)"
      >
        <div class="modal-dialog" :class="getDialogClass()">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ title || defaultTitle }}</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                @click="onCloseBtnClick"
              ></button>
            </div>
            <div class="modal-body">
              <span
                v-if="!content"
                class="d-flex justify-content-center align-items-center flex-column confirm-message"
                ><i :class="icon || defaultIcon"></i
                ><span>{{ message || defaultMessage }}</span></span
              >
              <template v-if="content">
                <span ref="content"> </span>
              </template>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="onLeftBtnClick"
              >
                {{ leftBtnText || defaultLeftBtnText }}
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="onRightBtnClick"
              >
                {{ rightBtnText || defaultRightBtnText }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal-backdrop bs-dialog-animated"
        :class="getDialogBackdropClass()"
      ></div>
    </span>
  </div>
</template>
<script lang="ts">
import {
  Component,
  render,
  createVNode,
  defineComponent,
  PropType,
  VNode,
} from "vue";
import { ModalRef, ContentRef, ModalSize } from "../models/model";
interface Data {
  defaultTitle: string;
  defaultMessage: string;
  defaultLeftBtnText: string;
  defaultRightBtnText: string;
  defaultIcon: string;
  show: boolean;
  out: boolean;
  contentRef: ContentRef | undefined;
}

const MODAL_CENTTER_CLASS = "modal-dialog-centered";
const MODAL_CLASS = "bs-dialog";
const FADE_IN_CLASS = "dialog-fadeIn";
const FADE_OUT_CLASS = "dialog-fadeOut";
const FADE_IN_DOWN_CLASS = "dialog-fadeInDown";
const FADE_OUT_UP_CLASS = "dialog-fadeOutUp";

export default defineComponent({
  name: "DialogComponent",
  data(): Data {
    return {
      defaultTitle: "Confirmation",
      defaultMessage: "Do you want to do this action?",
      defaultLeftBtnText: "Cancel",
      defaultRightBtnText: "Confirm",
      defaultIcon: "bi bi-question-circle-fill",
      show: false,
      out: false,
      contentRef: undefined,
    };
  },
  props: {
    title: {
      type: String as PropType<string>,
    },
    message: {
      type: String as PropType<string>,
    },
    icon: {
      type: String as PropType<string>,
    },
    size: {
      type: String as PropType<ModalSize>,
    },
    leftBtnText: {
      type: String as PropType<string>,
    },
    rightBtnText: {
      type: String as PropType<string>,
    },
    center: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    content: {
      type: Object as PropType<Component>,
    },
    contentProps: {
      type: Object as PropType<Record<string, unknown>>,
    },
    modalRef: {
      type: Object as PropType<ModalRef>,
      required: true,
    },
    resolve: {
      type: Function,
      required: true,
    },
    reject: {
      type: Function,
      required: true,
    },
  },
  created() {
    this.show = true;
  },
  mounted() {
    if (this.content) {
      this.renderContent();
    }
  },
  beforeUnmount() {
    this.clearContent();
  },
  methods: {
    onRightBtnClick() {
      const resolvedValue = this.content
        ? {
            confirmed: true,
            modalRef: this.modalRef,
            data: this.contentRef?.internalComponentVNode?.component?.data,
          }
        : true;
      if (!this.content) {
        this.closeModal();
      }
      this.resolve?.(resolvedValue);
    },

    onLeftBtnClick() {
      this.onCloseBtnsResolve();
      if (!this.content) {
        this.closeModal();
      }
    },

    onBackdropClick(event: MouseEvent) {
      if ((event.target as HTMLElement)?.classList?.contains(MODAL_CLASS)) {
        this.onCloseBtnClick();
      }
    },

    onCloseBtnClick() {
      this.onCloseBtnsResolve();
      this.closeModal();
    },

    onCloseBtnsResolve() {
      const resolvedValue = this.content
        ? {
            confirmed: false,
            modalRef: this.modalRef,
            data: this.contentRef?.internalComponentVNode?.component?.data,
          }
        : false;
      this.resolve?.(resolvedValue);
    },

    closeModal() {
      this.modalRef?.close();
    },

    renderContent() {
      const el = this.$refs.content as HTMLElement;
      const props = {
        ...this.contentProps,
      };
      let vnode: VNode | undefined = createVNode(
        this.content as Component,
        props
      );

      this.contentRef = {
        clear: () => {
          render(null, el);
          vnode = undefined;
        },
        internalComponentVNode: vnode,
      };
      render(vnode, el);
    },

    clearContent() {
      (this.contentRef as ContentRef)?.clear();
    },

    getDialogClass() {
      let clazz;
      if (this.size) {
        clazz = {
          [this.size]: true,
        };
      }
      clazz = {
        ...clazz,
        [MODAL_CENTTER_CLASS]: this.center,
      };
      return clazz;
    },

    getDialogContainerClass() {
      return {
        show: this.show,
        [MODAL_CLASS]: this.show,
        [FADE_IN_DOWN_CLASS]: this.show,
        [FADE_OUT_UP_CLASS]: this.out,
      };
    },

    getDialogBackdropClass() {
      return {
        show: this.show,
        [FADE_IN_CLASS]: this.show,
        [FADE_OUT_CLASS]: this.out,
      };
    },
  },
});
</script>
<style lang="css" scoped>
.bs-dialog {
  display: block;
}

.confirm-message i {
  font-size: 3rem;
}

.bs-dialog-animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-duration: var(1);
  animation-duration: var(1);
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.5;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.5;
  }
}

.dialog-fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

@-webkit-keyframes fadeOut {
  from {
    opacity: 0.5;
  }

  to {
    opacity: 0;
  }
}
@keyframes fadeOut {
  from {
    opacity: 0.5;
  }

  to {
    opacity: 0;
  }
}
.dialog-fadeOut {
  -webkit-animation-name: fadeOut;
  animation-name: fadeOut;
}

@-webkit-keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.dialog-fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
}

@-webkit-keyframes fadeOutUp {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
@keyframes fadeOutUp {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
}
.dialog-fadeOutUp {
  -webkit-animation-name: fadeOutUp;
  animation-name: fadeOutUp;
}
</style>
