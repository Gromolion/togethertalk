<script setup lang="ts">
import AppLink from "@/primitives/App/AppLink";
import TypographyText from "@/primitives/Typography/TypographyText";
import { TypographyElements } from "@/primitives/Typography/enum";
import AppRoutes from "@/storage/appState/appRoutes";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Theme from "@/theme/theme";
import { computed } from "vue";
import { RoleProvider } from "@/utils/role";

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
      v-if="RoleProvider.isAdmin(store.state.auth.user)"
      :url="AppRoutes.getUsersUrl()"
      :class="{
        currentLink: currentRoute.path === AppRoutes.getUsersUrl(),
      }"
    >
      <TypographyText
        :element="TypographyElements.H5"
        :hoverColor="Theme.textColors.linkHover"
        >Сотрудники</TypographyText
      >
    </AppLink>
    <AppLink
      class="header-link"
      v-if="RoleProvider.isAdmin(store.state.auth.user)"
      :url="AppRoutes.getReportUrl()"
      :class="{
        currentLink: currentRoute.path === AppRoutes.getReportUrl(),
      }"
    >
      <TypographyText
        :element="TypographyElements.H5"
        :hoverColor="Theme.textColors.linkHover"
        >Отчет</TypographyText
      >
    </AppLink>
    <TypographyText
      :element="TypographyElements.H5"
      :hoverColor="Theme.textColors.linkHover"
      style="cursor: pointer"
      @click="handleLogout()"
      >Профиль</TypographyText
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
