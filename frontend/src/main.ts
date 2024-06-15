import { computed, createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "@/App.vue";

import AppRoutes from "@/storage/appState/appRoutes";

import MainPage from "@/pages/MainPage.vue";
import ChatRoom from "@/pages/ChatRoomPage.vue";
import AuthorizationPage from "@/pages/AuthorizationPage.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import { RequestManager } from "@/utils/request";
import { store } from "@/storage";
import { initMiddlewares } from "@/services/api/middlewares";
import ResetPasswordPage from "@/pages/ResetPasswordPage.vue";
import ResetPasswordByHashPage from "@/pages/ResetPasswordByHashPage.vue";
import moment from "moment-timezone";
import UsersPage from "@/pages/UsersPage.vue";
import ReportPage from "@/pages/ReportPage.vue";

const routes = [
  { path: AppRoutes.getMainUrl(), component: MainPage },
  { path: AppRoutes.getMainCalendarUrl(), component: MainPage },
  {
    path: AppRoutes.getAuthorizationUrl(),
    component: AuthorizationPage,
    meta: { availableWithoutAuth: true, onlyWithoutAuth: true },
  },
  {
    path: AppRoutes.getResetPasswordUrl(),
    component: ResetPasswordPage,
    meta: { availableWithoutAuth: true, onlyWithoutAuth: true },
  },
  {
    path: AppRoutes.getResetPasswordByHashUrl(),
    name: "resetPasswordByHash",
    component: ResetPasswordByHashPage,
    meta: { availableWithoutAuth: true, onlyWithoutAuth: true },
  },
  { path: AppRoutes.getChatRoomUrl(), component: ChatRoom },
  { path: AppRoutes.getUsersUrl(), component: UsersPage },
  { path: AppRoutes.getReportUrl(), component: ReportPage },
  { path: "/:pathMatch(.*)*", redirect: AppRoutes.getMainUrl() },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.use(store);

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.availableWithoutAuth)) {
    next();
    return;
  }

  const token = computed(() => store.getters["auth/auth"].token);

  if (token.value) {
    next();
    return;
  }
  next(AppRoutes.getAuthorizationUrl());
});
router.beforeEach((to, from, next) => {
  const token = computed(() => store.getters["auth/auth"].token);

  if (token.value && to.matched.some((route) => route.meta.onlyWithoutAuth)) {
    next(AppRoutes.getMainUrl());
    return;
  }

  next();
});

initMiddlewares(store);

RequestManager.baseUrl = process.env.VUE_APP_API_URL;

moment.tz.setDefault("Europe/Moscow");

app.mount("#app");
