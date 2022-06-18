<template>
  <div id="modal">
    <span>
      <div
        class="modal bs-dialog-animated"
        :class="getDialogContainerClass()"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        @mousedown.left="setInitialTarget($event)"
        @mouseup.left="onBackdropClick($event)"
      >
        <div class="modal-dialog" :class="getDialogClass()">
          <div class="modal-content">
            <div class="modal-header" v-if="displayHeader">
              <h5 class="modal-title">{{ title }}</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                @click="onCloseBtnClick"
                v-if="displayCloseBtn"
              ></button>
            </div>
            <div class="modal-body">
              <span
                v-if="!content"
                class="d-flex justify-content-center align-items-center flex-column confirm-message"
                ><i :class="icon"></i
                ><span class="text-center">{{ message }}</span></span
              >
              <template v-if="content">
                <span ref="content"> </span>
              </template>
            </div>
            <div class="modal-footer" v-if="displayFooter">
              <button
                type="button"
                class="btn btn-secondary"
                @click="onLeftBtnClick"
                v-if="displayLeftBtn"
              >
                {{ leftBtnText }}
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="onRightBtnClick"
                v-if="displayRightBtn"
              >
                {{ rightBtnText }}
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
  AppContext,
  resolveComponent,
} from "vue";
import { ModalRef, ContentRef, ModalSize } from "../models/model";
interface Data {
  show: boolean;
  out: boolean;
  contentRef: ContentRef | undefined;
  initialTarget: HTMLElement | undefined;
}

const MODAL_CENTTER_CLASS = "modal-dialog-centered";
const MODAL_CLASS = "bs-dialog";
const FADE_IN_CLASS = "dialog-fadeIn";
const FADE_OUT_CLASS = "dialog-fadeOut";
const FADE_IN_DOWN_CLASS = "dialog-fadeInDown";
const FADE_OUT_UP_CLASS = "dialog-fadeOutUp";
const DISABLE_SCROLLING = "hidden";
const ENABLE_SCROLLING = "";

export default defineComponent({
  name: "ModalComponent",
  data(): Data {
    return {
      show: false,
      out: false,
      contentRef: undefined,
      initialTarget: undefined,
    };
  },
  props: {
    title: {
      type: String as PropType<string>,
      default: "Confirmation",
    },
    message: {
      type: String as PropType<string>,
      default: "Do you want to do this action?",
    },
    icon: {
      type: String as PropType<string>,
      default: "bi bi-question-circle-fill",
    },
    size: {
      type: String as PropType<ModalSize>,
    },
    leftBtnText: {
      type: String as PropType<string>,
      default: "Cancel",
    },
    rightBtnText: {
      type: String as PropType<string>,
      default: "Confirm",
    },
    center: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    displayHeader: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    displayFooter: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    displayCloseBtn: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    displayLeftBtn: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    displayRightBtn: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    autoCloseOnRightBtnClick: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    autoCloseOnLeftBtnClick: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    backgroundScrolling: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    content: {
      type: [Object, String] as PropType<Component | string>,
    },
    contentProps: {
      type: Object as PropType<Record<string, unknown>>,
    },
    modalRef: {
      type: Object as PropType<ModalRef>,
      required: true,
    },
    resolve: {
      type: Function as PropType<(value: unknown) => void>,
      required: true,
    },
    reject: {
      type: Function as PropType<(reason: unknown) => void>,
      required: true,
    },
    context: {
      type: Object as PropType<AppContext>,
      required: true,
    },
  },
  created() {
    this.show = true;
    if (!this.backgroundScrolling) {
      this.toggleBodyScrolling(false);
    }
  },
  mounted() {
    if (this.content) {
      this.renderContent();
    }
  },
  beforeUnmount() {
    this.clearContent();
  },
  unmounted() {
    if (!this.backgroundScrolling) {
      this.toggleBodyScrolling(true);
    }
  },
  methods: {
    onRightBtnClick() {
      this.onResolve(true);
      if (!this.content || this.autoCloseOnRightBtnClick) {
        this.closeModal();
      }
    },

    onLeftBtnClick() {
      this.onResolve(false);
      if (!this.content || this.autoCloseOnLeftBtnClick) {
        this.closeModal();
      }
    },

    setInitialTarget(event: MouseEvent) {
      this.initialTarget = event.target as HTMLElement;
    },

    onBackdropClick(event: MouseEvent) {
      const finalTarget = event.target as HTMLElement;
      if (
        finalTarget?.classList?.contains(MODAL_CLASS) &&
        finalTarget === this.initialTarget
      ) {
        this.onCloseBtnClick();
      }
    },

    onCloseBtnClick() {
      this.onResolve(false);
      this.closeModal();
    },

    onResolve(confirmed: boolean) {
      const resolvedValue = this.content
        ? {
            confirmed,
            modalRef: { ...this.modalRef },
            data: this.contentRef?.internalComponentVNode?.component?.data,
          }
        : confirmed;
      this.resolve(resolvedValue);
    },

    closeModal() {
      this.modalRef.close();
    },

    renderContent() {
      const el = this.$refs.content as HTMLElement;
      const props = {
        ...this.contentProps,
        modalRef: { ...this.modalRef },
      };
      const component =
        typeof this.content === "string"
          ? resolveComponent(this.content)
          : (this.content as Component);

      if (typeof component === "string") {
        console.error(
          `Unknown component name: ${component}. Did you register it to your vue instance?`
        );
      }
      let vnode: VNode | undefined = createVNode(
        this.content as Component,
        props
      );
      vnode.appContext = this.context;
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

    toggleBodyScrolling(scroll: boolean) {
      scroll
        ? (document.body.style.overflow = ENABLE_SCROLLING)
        : (document.body.style.overflow = DISABLE_SCROLLING);
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
  --animation-duration: 0.5s;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-duration: var(--animation-duration);
  animation-duration: var(--animation-duration);
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
