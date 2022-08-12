import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Modal from "vue-bs-modal";

import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);
app.use(router).use(Modal).mount("#app");
