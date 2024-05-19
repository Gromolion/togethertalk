import { RequestManager } from "@/utils/request";
import { Store } from "vuex";

export const initMiddlewares = (store: Store) => {
  RequestManager.beforeRequestMiddleware.push(({ config }) => {
    if (!config.headers) config.headers = {};

    const token = store.state.auth.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  });
};
