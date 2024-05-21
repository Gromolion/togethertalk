import AuthModel from "@/storage/modules/auth/AuthModel";
import { AuthGateway } from "@/services/api/gateway/auth.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";

export const auth = {
  namespaced: true,
  state: {
    token: null,
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
      state.token = loginResult.token;
      state.user = loginResult.user;
    },
    loginFailure(state) {
      state.token = null;
      state.user = null;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
};
