import { createApp } from "vue";
import App from "@/App.vue";
import ChatRoom from "@/components/ChatRoom/ChatRoom.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{ path: "/", component: ChatRoom }];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount("#app");
