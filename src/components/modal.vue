<template>
  <div id="vbs-modal">
    <span>
      <transition
        appear
        mode="out-in"
        name="custom-classes"
        enter-active-class="bs-dialog-animated dialog-fadeInDown"
        leave-active-class="bs-dialog-animated dialog-fadeOutUp"
      >
        <div
          v-if="!out"
          class="modal"
          :class="getDialogContainerClass()"
          tabindex="-1"
          aria-modal="true"
          role="dialog"
          @mousedown.left="setInitialTarget($event)"
          @mouseup.left="onBackdropClick($event)"
        >
          <div class="modal-dialog" :class="getDialogClass()">
            <div class="modal-content" v-if="!full">
              <div class="modal-header">
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
                  class="d-flex justify-content-center align-items-center flex-column confirm-message"
                  ><i :class="icon"></i
                  ><span class="text-center">{{ message }}</span></span
                >
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="onCancel"
                >
                  {{ leftBtnText }}
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="onConfirm"
                >
                  {{ rightBtnText }}
                </button>
              </div>
            </div>
            <div class="modal-content" v-if="full">
              <component :is="content" v-bind="contentProps"></component>
            </div>
          </div>
        </div>
      </transition>
      <transition
        appear
        mode="out-in"
        name="custom-classes"
        enter-active-class="bs-dialog-animated dialog-fadeIn"
        leave-active-class="bs-dialog-animated dialog-fadeOut"
      >
        <div
          class="modal-backdrop"
          :class="getDialogBackdropClass()"
          v-if="!out"
        ></div>
      </transition>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, defineComponent, PropType } from "vue";
import { ModalSize, MODAL_DELAY } from "../models/model";

interface Data {
  show: boolean;
  out: boolean;
  pulse: boolean;
  initialTarget: HTMLElement | undefined;
  disableScrolling: boolean;
}

const MODAL_CENTER_CLASS = "modal-dialog-centered";
const MODAL_PULSE_CLASS = "bs-dialog-animated dialog-pulse";
const MODAL_SHOW_CLASS = "bs-dialog-show";
const DISABLE_SCROLLING = "hidden";
const ENABLE_SCROLLING = "";

export default defineComponent({
  name: "VBSModal",
  data(): Data {
    return {
      show: false,
      out: false,
      pulse: false,
      initialTarget: undefined,
      disableScrolling: false,
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
    backgroundScrolling: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    staticBackdrop: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    displayCloseBtn: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    content: {
      type: [Object, String] as PropType<Component | string>,
    },
    contentProps: {
      type: Object as PropType<Record<string, unknown>>,
    },
    resolve: {
      type: Function as PropType<(value: unknown) => void>,
    },
    reject: {
      type: Function as PropType<(reason: unknown) => void>,
    },
    full: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  created() {
    this.show = true;
    if (!this.backgroundScrolling) {
      this.disableScrolling = true;
      this.toggleBodyScrolling(false);
    }
  },
  unmounted() {
    if (!this.backgroundScrolling && this.disableScrolling) {
      this.toggleBodyScrolling(true);
    }
  },
  methods: {
    onConfirm() {
      this.resolve?.(true);
      this.closeModal();
    },

    onCancel() {
      this.resolve?.(false);
      this.closeModal();
    },

    setInitialTarget(event: MouseEvent) {
      this.initialTarget = event.target as HTMLElement;
    },

    onBackdropClick(event: MouseEvent) {
      const finalTarget = event.target as HTMLElement;
      if (!finalTarget?.classList?.contains(MODAL_SHOW_CLASS)) {
        return;
      }
      if (finalTarget === this.initialTarget) {
        if (this.staticBackdrop) {
          this.pulse = true;
          setTimeout(() => (this.pulse = false), MODAL_DELAY);
          return;
        }
        this.resolve?.(false);
        this.closeModal();
      }
    },

    onCloseBtnClick() {
      this.resolve?.(false);
      this.closeModal();
    },

    closeModal() {
      this.$vbsModal?.close();
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
        [MODAL_PULSE_CLASS]: this.pulse,
        [MODAL_CENTER_CLASS]: this.center,
      };
      return clazz;
    },

    getDialogContainerClass() {
      return {
        [MODAL_SHOW_CLASS]: this.show,
      };
    },

    getDialogBackdropClass() {
      return {
        [MODAL_SHOW_CLASS]: this.show,
      };
    },
  },
});
</script>
<style lang="css" scoped>
.modal.bs-dialog-show {
  display: block;
  overflow-y: auto;
}

.modal-backdrop.bs-dialog-show {
  opacity: 0.5;
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

@-webkit-keyframes bsFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.5;
  }
}
@keyframes bsFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.5;
  }
}

.dialog-fadeIn {
  -webkit-animation-name: bsFadeIn;
  animation-name: bsFadeIn;
}

@-webkit-keyframes bsFadeOut {
  from {
    opacity: 0.5;
  }

  to {
    opacity: 0;
  }
}
@keyframes bsFadeOut {
  from {
    opacity: 0.5;
  }

  to {
    opacity: 0;
  }
}
.dialog-fadeOut {
  -webkit-animation-name: bsFadeOut;
  animation-name: bsFadeOut;
}

@-webkit-keyframes bsFadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -10%, 0);
    transform: translate3d(0, -10%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes bsFadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -10%, 0);
    transform: translate3d(0, -10%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.dialog-fadeInDown {
  -webkit-animation-name: bsFadeInDown;
  animation-name: bsFadeInDown;
}

@-webkit-keyframes bsFadeOutUp {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -10%, 0);
    transform: translate3d(0, -10%, 0);
  }
}
@keyframes bsFadeOutUp {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, -10%, 0);
    transform: translate3d(0, -10%, 0);
  }
}
.dialog-fadeOutUp {
  -webkit-animation-name: bsFadeOutUp;
  animation-name: bsFadeOutUp;
}

@-webkit-keyframes bsPulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  50% {
    -webkit-transform: scale3d(1.02, 1.02, 1.02);
    transform: scale3d(1.02, 1.02, 1.02);
  }

  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
@keyframes bsPulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  50% {
    -webkit-transform: scale3d(1.02, 1.02, 1.02);
    transform: scale3d(1.02, 1.02, 1.02);
  }

  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
.dialog-pulse {
  -webkit-animation-name: bsPulse;
  animation-name: bsPulse;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}
</style>
