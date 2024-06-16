import { RequestManager } from "@/utils/request";
import { Store } from "vuex";
import { computed } from "vue";
import { AppRequestError } from "@/utils/request/AppRequestError";
import { ApiErrorCodes } from "@/enums/errors";
import { Router } from "vue-router";
import AppRoutes from "@/storage/appState/appRoutes";

export const initMiddlewares = (store: Store, router: Router) => {
  RequestManager.beforeRequestMiddleware.push(({ config }) => {
    if (!config.headers) config.headers = {};

    const token = computed(() => store.getters["auth/auth"].token);

    if (token.value) {
      config.headers["Authorization"] = `Bearer ${token.value}`;
    }
  });

  RequestManager.beforeErrorMiddleware.push(async ({ error }) => {
    if (error.statusCode === ApiErrorCodes.UNAUTHORIZED) {
      await store.dispatch("auth/logout");
      await router.push(AppRoutes.getAuthorizationUrl());
      await router.go();
      return;
    }

    return error;
  });

  RequestManager.beforeErrorMiddleware.push(({ error }) => {
    error.message = error.axiosError?.response.data.message || error.message;

    return error;
  });
};
