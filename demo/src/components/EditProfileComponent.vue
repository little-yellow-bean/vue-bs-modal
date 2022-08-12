<template>
  <div id="login">
    <div class="modal-header">
      <h5 class="modal-title">Edit Profile</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="close"
      ></button>
    </div>
    <div class="modal-body">
      <form>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            v-model="username"
            id="username"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="email" v-model="email" />
        </div>
        <div class="mb-3 form-check d-flex align-items-center gap-5">
          <div>
            <input
              type="checkbox"
              class="form-check-input"
              id="private-account"
              :value="false"
              v-model="private"
            />
            <label class="form-check-label" for="private-account"
              >Private Account</label
            >
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" @click="close">
        Cancel
      </button>
      <button type="button" class="btn btn-danger" @click="deleteProfile">
        Delete
      </button>
      <button type="button" class="btn btn-success" @click="updateProfile">
        Update
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
export interface UserProfile {
  username: string;
  email: string;
  private: boolean;
}
export default defineComponent({
  name: "EditProfileComponent",
  emits: ["onUpdate"],
  data() {
    return {
      username: "",
      email: "",
      private: false,
    };
  },
  created() {
    this.email = this.emailAdress;
    this.username = this.userName;
    this.private = this.privateAccount;
  },
  methods: {
    close() {
      this.$vbsModal.close();
    },
    updateProfile() {
      if (!this.username || !this.email) {
        this.$vbsModal.confirm({
          icon: "bi bi-exclamation-triangle-fill",
          message: "Username or Email cannot be empty!",
          title: "Invalid Value",
          leftBtnText: "Close",
          rightBtnText: "Ok",
          staticBackdrop: this.staticBackdrop,
          center: this.center,
        });
        return;
      }
      this.$emit("onUpdate", {
        username: this.username,
        email: this.email,
        private: this.private,
      });
    },
    deleteProfile() {
      this.$vbsModal
        .confirm({
          message: "Are you sure you want to delete your profile?",
          title: "Delete Profile",
          staticBackdrop: this.staticBackdrop,
          center: this.center,
        })
        .then((confirmed) => {
          if (confirmed) {
            this.$vbsModal.confirm({
              icon: "bi bi-x-octagon-fill",
              message: "Sorry you can't do this!",
              title: "Deletion Failed",
              leftBtnText: "Close",
              rightBtnText: "Ok",
              staticBackdrop: this.staticBackdrop,
              center: this.center,
            });
          }
        });
    },
  },
  props: {
    emailAdress: {
      type: String as PropType<string>,
      default: "",
    },
    privateAccount: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    userName: {
      type: String as PropType<string>,
      default: "",
    },
    staticBackdrop: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    center: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
});
</script>
<style lang="css"></style>
