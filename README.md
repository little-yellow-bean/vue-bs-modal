# vue-bs-modal

A Bootstrap style modal for Vue.js

<a style="color:#00d1a1;font-weight:700;font-size:20px" href="http://vue-bs-modal.yellowbean.top"
        target="_blank">
Demo
</a>

## Installation

```bash
npm install vue-bs-modal
```

## Usage

### In main.ts

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import Modal from "vue-bs-modal";

// you have to include bootstrap css in your project. (Bootstrap 5 is recommended)
import "bootstrap/dist/css/bootstrap.min.css";
// import bootstrap icons (this is not required, you can use your own icon class)
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);
app.use(Modal).mount("#app");
```

### In components

#### confirmation modal:

```javascript
 async beforeRouteLeave() {
    // once this library is installed. it will add a $vbsModal global property to the app instance.
    const confirmed = await this.$vbsModal.confirm({
      title: "Unsaved Changes",
      message: "Are you sure you want to leave this page?",
    });
    return confirmed;
  }

```

#### common modal:

```javascript
 openProfileModal() {
      this.$vbsModal
        .open({
          // pass your component as the whole modal content
          // you can also use the component's registered name
          content: EditProfileComponent,
          size: ModalSize.LARGE,
          // pass custom data as props to the EditProfileComponent.
          contentProps: {
            email: "example@example.com",
            username: "yellowbean",
            onSubmit: this.onSubmitProfileForm
          },
          center: true, // default is false
          backgroundScrolling: true, // default is false
          staticBackdrop: true, // will disable backdrop click to close modal if true
        });
    },

 onSubmitProfileForm(data: any) {
      // do profile update logic
        ...

      this.$vbsModal.close();
    }

```

## License

[MIT](https://github.com/little-yellow-bean/vue-bs-modal/blob/main/LICENSE)
