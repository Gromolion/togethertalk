<script setup lang="ts">
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import AppLink from "@/primitives/App/AppLink";
import AppRoutes from "@/storage/appState/appRoutes.ts";

const src = `${window.location.origin}/assets/logo.svg`;
</script>

<template>
  <div>
    <AppLink :url="AppRoutes.getMainUrl()" id="logoAndText">
      <img :src="src" alt="logo"/>
      <TypographyText :element="TypographyElements.H2" color="#000206">TogetherTalk</TypographyText>
    </AppLink>
  </div>
</template>

<style scoped>
div {
  display: flex;
  align-items: center;
}

img {
  max-width: 80px;
}

#logoAndText {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
