import AuthModel from "@/storage/modules/auth/AuthModel";
import { AuthGateway } from "@/services/api/gateway/auth.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";

export const auth = {
  namespaced: true,
  state: {
    token: null,
    userId: null,
    token: null,
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
      state.userId = loginResult.userId;
    },
    loginFailure(state) {
      state.token = null;
      state.userId = null;
    },
    logout(state) {
      state.token = null;
      state.userId = null;
    },
  },
};
