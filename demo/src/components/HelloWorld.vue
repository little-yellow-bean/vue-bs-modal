<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For use guide please refer to
      <a :href="repoUrl" target="_blank" rel="noopener">documentation</a>.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  data() {
    return {
      repoUrl: process.env.VUE_APP_REPO_URL,
    };
  },
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
