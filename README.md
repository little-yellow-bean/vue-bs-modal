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

// you have to import bootstrap css.
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
    const confirmed = await this.$modal.confirm({
      title: "Unsaved Changes",
      message: "Are you sure you want to leave this page?",
    });
    return confirmed;
  }

```

#### common modal:

```javascript
 editProfile() {
      this.$modal
        .show({
          title: "Edit Profile",
          // pass your component as the modal body content
          // you can also use the component's registered name
          content: EditProfileComponent,
          rightBtnText: "Update",
          leftBtnText: "Discard",
          // a method name of your content component, which will be called when left button is clicked
          // can return false if you don't want the promise resolve
          leftBtnHandler: "doNothing",
          // a method name of your content component, which will be called when right button is clicked
          // can return false if you don't want the promise resolve
          rightBtnHandler: "doUpdateProfile",
          // a method name of your content component, which will be called when any ModalAction occurs, and the returned value of this method will be the data property of the ModalReturn. Default is "onResolveData"
          resolveDataHander: "onResolveData",
          size: ModalSize.LARGE,
          // pass custom data as props to the EditProfileComponent.
          // the "modalRef" prop is passed to the content componet by default in case you want to close the modal inside your component.
          contentProps: {
            email: "example@example.com",
            username: "yellowbean"
          },
          center: true,
          displayHeader: true, // default is true
          displayFooter: true, // default is true
          displayCloseBtn: true, // default is true
          displayLeftBtn: true, // default is true
          displayRightBtn: true, // default is true
          autoCloseOnRightBtnClick: true, // default is false
          autoCloseOnLeftBtnClick: true, // default is false
          backgroundScrolling: true, // default is false
        })
        .then(({ action, modalRef, data }) => {
          // action is a type of ModalAction: LEFT_BTN_CLICK, RIGHT_BTN_CLICK, CLOSE_BTN_CLICK, BACKDROP_CLICK
          // data will be the returned value of resolveDataHander method


          // you can choose to close the modal here, or inside your content component, or just set the autoClose configuration.
          modalRef.close();
        });
    },

```

## License

[MIT](https://github.com/little-yellow-bean/vue-bs-modal/blob/main/LICENSE)
