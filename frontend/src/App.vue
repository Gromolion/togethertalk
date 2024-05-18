<template>
  <HeaderPanel />
  <AppView />
  <ToastNotification />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HeaderPanel from "@/components/Base/Header/HeaderPanel.vue";
import AppView from "@/primitives/App/AppView.vue";
import ToastNotification from "@/primitives/Toast/ToastNotification.vue";

@Options({
  components: {
    ToastNotification,
    AppView,
    HeaderPanel,
  },
})
export default class App extends Vue {}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}

* {
  box-sizing: border-box;
}
</style>
