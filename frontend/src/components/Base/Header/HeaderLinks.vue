<script setup lang="ts">
import AppLink from "@/primitives/App/AppLink";
import TypographyText from "@/primitives/Typography/TypographyText";
import { TypographyElements } from "@/primitives/Typography/enum";
import AppRoutes from "@/storage/appState/appRoutes";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Theme from "@/theme/theme";
import { computed, ref } from "vue";
import { RoleProvider } from "@/utils/role";
import { createBase64Image } from "@/utils/image";
import UserDetailed from "@/components/User/UserDetailed.vue";

const store = useStore();
const router = useRouter();

const token = computed(() => store.getters["auth/auth"].token);

const handleLogout = async () => {
  await store.dispatch("auth/logout");

  await router.push({ path: AppRoutes.getAuthorizationUrl(), reload: true });
  router.go();
};

const currentRoute = computed(() => router.currentRoute.value);

const detailModalOpened = ref(false);
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
    <div class="dropdown">
      <button
        class="profileBtn dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          :src="createBase64Image(store.state.auth.user.avatar)"
          v-if="store.state.auth.user.avatar"
          alt="Фото профиля"
          width="48"
          height="48"
          class="profileImage"
        />
        <div
          v-else
          class="profileImage noAvatar d-flex justify-content-center align-items-center"
        >
          <i class="bi bi-person" />
        </div>
      </button>
      <ul class="dropdown-menu">
        <li class="dropdown-item p-3">
          <TypographyText
            :element="TypographyElements.H5"
            :hoverColor="Theme.textColors.linkHover"
            @click="detailModalOpened = true"
            >Профиль</TypographyText
          >
        </li>
        <li class="dropdown-item p-3">
          <TypographyText
            :element="TypographyElements.H5"
            :hoverColor="Theme.textColors.linkHover"
            @click="handleLogout()"
            >Выйти</TypographyText
          >
        </li>
      </ul>
    </div>
    <UserDetailed
      v-if="detailModalOpened"
      :user="store.state.auth.user"
      without-delete
      @close="detailModalOpened = false"
    />
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

.profileBtn {
  border: none;
  background: none;
}

.dropdown-toggle::after {
  display: none !important;
}

.dropdown-menu {
  padding: 0 !important;
}

.dropdown-item {
  cursor: pointer;
}

.profileImage {
  width: 48px;
  height: 48px;
  border-radius: 100px;
}

.profileImage:hover {
  filter: brightness(80%);
}

.noAvatar {
  background-color: #e0dfdf;
}

.noAvatar i {
  font-size: 2rem;
}
</style>
