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

  await router.push({ path: AppRoutes.getAuthorizationUrl(), reload: true });
  router.go();
};

const currentRoute = computed(() => router.currentRoute.value);
</script>

<template>
  <div id="header-links-container" v-if="token">
    <AppLink
      class="header-link"
      :url="AppRoutes.getMainUrl()"
      :class="{
        currentLink: [
          AppRoutes.getMainUrl(),
          AppRoutes.getMainCalendarUrl(),
        ].includes(currentRoute.path),
      }"
    >
      <TypographyText
        :element="TypographyElements.H5"
        :hoverColor="Theme.textColors.linkHover"
        >Главная</TypographyText
      >
    </AppLink>
    <AppLink
      class="header-link"
      :url="AppRoutes.getChatRoomUrl()"
      :class="{ currentLink: currentRoute.path === AppRoutes.getChatRoomUrl() }"
    >
      <TypographyText
        :element="TypographyElements.H5"
        :hoverColor="Theme.textColors.linkHover"
        >Создать чат</TypographyText
      >
    </AppLink>
    <TypographyText
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

.currentLink {
  border-bottom: 1px solid #5b5b5b;
}
</style>
