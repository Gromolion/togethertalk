<script setup lang="ts">
import AppLink from "@/primitives/App/AppLink";
import TypographyText from "@/primitives/Typography/TypographyText";
import { TypographyElements } from "@/primitives/Typography/enum";
import AppRoutes from "@/storage/appState/appRoutes";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Theme from "@/theme/theme";
import { computed } from "vue";

const store = useStore();
const router = useRouter();

const token = computed(() => store.getters["auth/auth"].token);

const handleLogout = async () => {
  await store.dispatch("auth/logout");
  console.log(store.getters["auth/auth"].token);
  await router.push({ path: AppRoutes.getAuthorizationUrl(), reload: true });
  router.go();
};
</script>

<template>
  <div id="header-links-container">
    <AppLink class="header-link" :url="AppRoutes.getMainUrl()">
      <TypographyText
        :element="TypographyElements.H5"
        :hoverColor="Theme.textColors.linkHover"
        >Главная</TypographyText
      >
    </AppLink>
    <AppLink class="header-link" :url="AppRoutes.getChatRoomUrl()">
      <TypographyText
        :element="TypographyElements.H5"
        :hoverColor="Theme.textColors.linkHover"
        >Создать чат</TypographyText
      >
    </AppLink>
    <TypographyText
      v-if="token"
      :element="TypographyElements.H5"
      :hoverColor="Theme.textColors.linkHover"
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
