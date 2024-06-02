import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";

import { auth } from "@/storage/modules/auth";
import { toast } from "@/storage/modules/toast";

const authStorePlugin = createPersistedState({
  paths: ["auth"],
});

export const store = createStore({
  modules: {
    auth,
    toast,
  },
  plugins: [authStorePlugin],
});
