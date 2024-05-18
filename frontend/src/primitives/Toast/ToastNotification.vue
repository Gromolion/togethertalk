<script setup lang="ts">
import { useStore } from "vuex";
import { ToastsTypes } from "@/enums/toastsTypes";

const store = useStore();
const handleToastClose = (toast) => {
  store.dispatch("toast/remove", toast.uid);
};

const toastTypeToColor = {
  [ToastsTypes.SUCCESS]: {
    border: "var(--bs-toast-border-width) solid green !important",
  },
  [ToastsTypes.ERROR]: {
    border: "var(--bs-toast-border-width) solid red !important",
  },
};

const getBorderStyle = (toast) => {
  return toastTypeToColor[toast.type].border;
};
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div class="toast show collapse" role="alert" aria-live="assertive" aria-atomic="true"
         @click="handleToastClose(toast)"
         v-for="toast in store.state.toast.toasts" v-bind:key="toast.uid" :style="{border: getBorderStyle(toast)}">
      <div v-if="toast.title" class="toast-header" :style="{'border-bottom': getBorderStyle(toast)}">
        <strong class="me-auto">{{ toast.title }}</strong>
      </div>
      <div class="toast-body">{{ toast.message }}</div>
    </div>
  </div>
</template>