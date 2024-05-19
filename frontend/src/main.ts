import { createApp } from "vue";
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

const routes = [
  { path: AppRoutes.getMainUrl(), component: MainPage },
  {
    path: AppRoutes.getAuthorizationUrl(),
    component: AuthorizationPage,
    meta: { availableWithoutAuth: true },
  },
  { path: AppRoutes.getChatRoomUrl(), component: ChatRoom },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.use(store);

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.availableWithoutAuth)) next();

  if (store.state.auth.token) {
    next();
  } else {
    next(AppRoutes.getAuthorizationUrl());
  }
});

initMiddlewares(store);

RequestManager.baseUrl = process.env.VUE_APP_API_URL;

app.mount("#app");
