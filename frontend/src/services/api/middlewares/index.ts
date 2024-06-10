import { RequestManager } from "@/utils/request";
import { Store } from "vuex";
import { computed } from "vue";

export const initMiddlewares = (store: Store) => {
  RequestManager.beforeRequestMiddleware.push(({ config }) => {
    if (!config.headers) config.headers = {};

    const token = computed(() => store.getters["auth/auth"].token);

    if (token.value) {
      config.headers["Authorization"] = `Bearer ${token.value}`;
    }
  });

  RequestManager.beforeErrorMiddleware.push(({ error }) => {
    error.message = error.axiosError?.response.data.message || error.message;

    return error;
  });
};
