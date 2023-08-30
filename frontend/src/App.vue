<template>
  <HeaderPanel />
  <AppView />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HeaderPanel from "@/components/Base/Header/HeaderPanel.vue";
import AppView from "@/primitives/App/AppView.vue";

@Options({
  components: {
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
}

* {
  box-sizing: border-box;
}
</style>
