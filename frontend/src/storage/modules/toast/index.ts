import { ToastsTypes } from "@/enums/toastsTypes";

export interface ToastInterface {
  title: string;
  message: string;
  type: ToastsTypes;
  uid?: string;
}

export const toast = {
  namespaced: true,
  state: {
    toasts: [],
  },
  actions: {
    new({ commit }, toast: ToastInterface) {
      commit("append", toast);
      setTimeout(() => commit("remove", toast.uid), 5000);
    },
    remove({ commit }, uid: string) {
      commit("remove", uid);
    },
  },
  mutations: {
    append(state, toast: ToastInterface) {
      toast.uid = Math.random().toString(16).slice(2);
      state.toasts.push(toast);
    },
    remove(state, uid: string) {
      state.toasts = state.toasts.filter(
        (toast: ToastInterface) => toast.uid !== uid
      );
    },
  },
};
