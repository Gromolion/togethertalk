<script setup lang="ts">
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import AppLink from "@/primitives/App/AppLink";
import AppRoutes from "@/storage/appState/appRoutes.ts";
</script>

<template>
  <div>
    <AppLink :url="AppRoutes.getMainUrl()">
      <TypographyText :element="TypographyElements.H2" color="white"
        >TogetherTalk</TypographyText
      >
    </AppLink>
  </div>
</template>

<style scoped>
div {
  display: flex;
  align-items: center;
}
</style>
