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
      return AuthGateway.login(authModel).then(
        (user) => {
          commit("loginSuccess", user);
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure", error);
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  mutations: {
    loginSuccess(state, loginResult) {
      state.user = loginResult.user;
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + loginResult.expiresIn);
      AuthCookieStorage.set(loginResult.token, expiresAt);
    },
    loginFailure() {
      AuthCookieStorage.clear();
    },
    logout() {
      AuthCookieStorage.clear();
    },
  },
  getters: {
    auth() {
      return AuthCookieStorage.get();
    },
  },
};
