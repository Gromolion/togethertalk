import { RequestManager } from "@/utils/request";
import { useStore } from "vuex";

export const initMiddlewares = () => {
  RequestManager.beforeRequestMiddleware.push(({ config }) => {
    if (!config.headers) config.headers = {};

    const store = useStore();
    const token = store.state.auth.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  });
};
