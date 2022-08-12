<template>
  <div class="about d-flex flex-column align-items-center">
    <div class="card" style="width: 35%; min-width: 20rem">
      <h5 class="card-header">Profile</h5>
      <div class="card-body">
        <h6 class="card-subtitle mb-2 text-muted">{{ username }}</h6>
        <p class="card-text">
          {{ email }}
        </p>
        <div class="card-text mb-3">
          <div class="badge bg-success" v-if="!private">Public</div>
          <div class="badge bg-secondary" v-if="private">Private</div>
        </div>
        <button class="btn btn-primary" @click="editProfile">Edit</button>
      </div>
    </div>
    <div class="mt-3">
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="bootstrap-style"
          id="bootstrap-option"
          :value="true"
          v-model="isNormal"
          @change="setCss"
        />
        <label class="form-check-label" for="bootstrap-option">Bootstrap</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="bootstrap-style"
          id="mdb-option"
          :value="false"
          v-model="isNormal"
          @change="setCss"
        />
        <label class="form-check-label" for="mdb-option">Material</label>
      </div>
      <div class="form-check form-check-inline form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="static-backdrop"
          v-model="staticBackdrop"
        />
        <label class="form-check-label" for="static-backdrop"
          >Static Backdrop</label
        >
      </div>
      <div class="form-check form-check-inline form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="centered"
          v-model="centered"
        />
        <label class="form-check-label" for="centered">Centered</label>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ModalSize } from "vue-bs-modal";
import EditProfileComponent, {
  UserProfile,
} from "../components/EditProfileComponent.vue";
interface IData {
  username: string;
  email: string;
  private: boolean;
  isNormal: boolean;
  mdb: string;
  bs: string;
  bsId: string;
  mbdId: string;
  bsStyleExisting: HTMLElement | null;
  mbdStyleExisting: HTMLElement | null;
  staticBackdrop: boolean;
  centered: boolean;
}
export default defineComponent({
  name: "ModalView",
  data(): IData {
    return {
      username: "YellowBean",
      email: "example@example.com",
      private: false,
      isNormal: true,
      mdb: "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.2.0/mdb.min.css",
      bs: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
      bsId: "bootstrap",
      mbdId: "mbd",
      bsStyleExisting: null,
      mbdStyleExisting: null,
      staticBackdrop: false,
      centered: false,
    };
  },
  created() {
    this.bsStyleExisting = document.getElementById(this.bsId);
    this.mbdStyleExisting = document.getElementById(this.mbdId);
    this.isNormal = !!this.bsStyleExisting;
  },
  methods: {
    setCss() {
      let styleEle: HTMLStyleElement | undefined;
      let link: string | undefined;
      let id: string | undefined;
      if (this.isNormal) {
        if (!this.bsStyleExisting) {
          this.bsStyleExisting = styleEle = document.createElement("link");
          link = this.bs;
          id = this.bsId;
        }
      } else {
        if (!this.mbdStyleExisting) {
          this.mbdStyleExisting = styleEle = document.createElement("link");
          link = this.mdb;
          id = this.mbdId;
        }
      }
      if (styleEle && link && id) {
        styleEle.setAttribute("href", link);
        styleEle.setAttribute("rel", "stylesheet");
        styleEle.setAttribute("id", id);
        styleEle.onload = () => {
          if (this.isNormal) {
            this.mbdStyleExisting?.remove();
            this.mbdStyleExisting = null;
          } else {
            this.bsStyleExisting?.remove();
            this.bsStyleExisting = null;
          }
        };
        document.head.appendChild(styleEle);
      }
    },
    editProfile() {
      this.$vbsModal.open({
        content: EditProfileComponent,
        size: ModalSize.LARGE,
        staticBackdrop: this.staticBackdrop,
        contentProps: {
          emailAdress: this.email,
          privateAccount: this.private,
          userName: this.username,
          staticBackdrop: this.staticBackdrop,
          center: this.centered,
        },
        contentEmits: {
          onUpdate: this.onUpdate,
        },
        center: this.centered,
        backgroundScrolling: false,
      });
    },
    onUpdate(data: UserProfile) {
      this.email = data.email;
      this.username = data.username;
      this.private = data.private;
      this.$vbsModal.close();
      this.$vbsModal
        .confirm({
          title: "Success",
          icon: "bi bi-patch-check-fill",
          message:
            "Update profile success! Do you want to give a star to this repository?",
          leftBtnText: "Next time",
          rightBtnText: "Sure",
          staticBackdrop: this.staticBackdrop,
          center: this.centered,
        })
        .then((confirmed) => {
          if (confirmed) {
            window.location.href = process.env.VUE_APP_REPO_URL as string;
          }
        });
    },
  },
  async beforeRouteLeave(): Promise<boolean> {
    const confirmed = await this.$vbsModal.confirm({
      icon: "bi bi-patch-question-fill",
      message: "Are you sure you want to leave this page?",
      staticBackdrop: this.staticBackdrop,
      center: this.centered,
    });
    return confirmed;
  },
});
</script>
