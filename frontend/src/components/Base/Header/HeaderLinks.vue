<script setup lang="ts">
import AppLink from "@/primitives/App/AppLink";
import TypographyText from "@/primitives/Typography/TypographyText";
import { TypographyElements } from "@/primitives/Typography/enum";
import AppRoutes from "@/storage/appState/appRoutes";
</script>

<template>
  <div id="header-links-container">
    <AppLink class="header-link" :url="AppRoutes.getMainUrl()">
      <TypographyText :element="TypographyElements.H4" color="#000206"
        >Главная</TypographyText
      >
    </AppLink>
    <AppLink class="header-link" :url="AppRoutes.getChatRoomUrl()">
      <TypographyText :element="TypographyElements.H4" color="#000206"
        >Создать чат</TypographyText
      >
    </AppLink>
  </div>
</template>

<style scoped>
#header-links-container {
  display: flex;
  align-items: center;
  gap: 30px;
}
</style>
