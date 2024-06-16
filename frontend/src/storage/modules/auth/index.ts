import AuthModel from "@/storage/modules/auth/AuthModel";
import { AuthGateway } from "@/services/api/gateway/auth.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";
import { AuthCookieStorage } from "@/storage/modules/auth/authCookieStorage";

export const auth = {
  namespaced: true,
  state: {
    user: null,
  },
  actions: {
    login({ commit }, authModel: AuthModel) {
      return AuthGateway.login(authModel)
        .then((user) => {
          commit("loginSuccess", user);
          return Promise.resolve(user);
        })
        .catch((error) => {
          commit("loginFailure");
          return Promise.reject(error);
        });
    },
    logout({ commit }) {
      commit("logout");
    },
    resetPassword({ commit }, login: string) {
      return AuthGateway.resetPassword(login)
        .then((response) => {
          return Promise.resolve(response.hash);
        })
        .catch(() => {});
    },
    resetPasswordByHash(
      { commit },
      payload: { hash: string; password: string }
    ) {
      return AuthGateway.resetPasswordByHash(payload.hash, payload.password)
        .then(() => {
          return Promise.resolve(true);
        })
        .catch(() => {});
    },
  },
  mutations: {
    loginSuccess(state, loginResult) {
      state.user = loginResult.user;
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + loginResult.expiresIn);
      AuthCookieStorage.set(loginResult.token, expiresAt, loginResult.userId);
    },
    loginFailure(state) {
      state.user = null;
      AuthCookieStorage.clear();
    },
    logout(state) {
      state.user = null;
      AuthCookieStorage.clear();
    },
  },
  getters: {
    auth() {
      return AuthCookieStorage.get();
    },
  },
};
