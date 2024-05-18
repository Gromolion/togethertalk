<script setup lang="ts">
import AppLink from "@/primitives/App/AppLink";
import TypographyText from "@/primitives/Typography/TypographyText";
import { TypographyElements } from "@/primitives/Typography/enum";
import AppRoutes from "@/storage/appState/appRoutes";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const handleLogout = async () => {
  await store.dispatch("auth/logout");
  await router.push({ path: AppRoutes.getAuthorizationUrl() });
};
</script>

<template>
  <div id="header-links-container">
    <AppLink class="header-link" :url="AppRoutes.getMainUrl()">
      <TypographyText :element="TypographyElements.H5">Главная</TypographyText>
    </AppLink>
    <AppLink class="header-link" :url="AppRoutes.getChatRoomUrl()">
      <TypographyText :element="TypographyElements.H5"
        >Создать чат</TypographyText
      >
    </AppLink>
    <TypographyText
      :element="TypographyElements.H5"
      style="cursor: pointer"
      @click="handleLogout()"
      >Выйти</TypographyText
    >
  </div>
</template>

<style scoped>
#header-links-container {
  display: flex;
  align-items: center;
  gap: 30px;
}
</style>
