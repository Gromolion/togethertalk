import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "@/App.vue";

import AppRoutes from "@/storage/appRoutes";

import MainPage from "@/pages/MainPage.vue";
import ChatRoom from "@/pages/ChatRoom.vue";

const routes = [
  { path: AppRoutes.getMainUrl(), component: MainPage },
  { path: AppRoutes.getChatRoomUrl(), component: ChatRoom },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount("#app");
