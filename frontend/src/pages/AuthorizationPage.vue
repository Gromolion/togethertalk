<script setup lang="ts">
import { ref } from "vue";
import AuthModel from "@/storage/modules/auth/AuthModel";
import InputField from "@/primitives/Input/InputField.vue";
import { useStore } from "vuex";
import { ToastsTypes } from "@/enums/toastsTypes";
import { useRouter } from "vue-router";
import AppRoutes from "@/storage/appState/appRoutes";

const togglePassword = ref(false);
const togglePasswordIconHovered = ref(false);

const model = new AuthModel();
const store = useStore();
const router = useRouter();

const loading = ref(false);

const handleSubmit = async () => {
  if (!model.isValid) return;

  loading.value = true;

  try {
    await store.dispatch("auth/login", model);

    loading.value = false;

    if (store.state.auth.token) {
      await router.push({ path: AppRoutes.getMainUrl() });
    }
  } catch (e) {
    loading.value = false;

    store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};
</script>

<template>
  <div class="container pt-5 px-5 pb-4" id="authContainer">
    <h5 id="authHeader" class="display-6">Авторизация</h5>
    <form @submit.prevent="handleSubmit">
      <div class="form-floating mb-4">
        <InputField
          id="loginInput"
          v-model="model.login"
          class-name="form-control"
          placeholder="Логин"
          label="Логин"
          :invalid="!!model.validationResult.causes.login"
          autocomplete="username"
        />
      </div>
      <div class="form-floating mb-4 d-flex">
        <InputField
          id="passwordInput"
          v-model="model.password"
          class-name="form-control"
          placeholder="Пароль"
          label="Пароль"
          :invalid="!!model.validationResult.causes.password"
          autocomplete="current-password"
          :type="togglePassword ? 'text' : 'password'"
        />
        <i
          class="bi h4"
          :class="[
            togglePassword ? 'bi-eye' : 'bi-eye-slash',
            { 'opacity-75': !togglePasswordIconHovered },
          ]"
          id="togglePassword"
          @click="togglePassword = !togglePassword"
          @mouseover="togglePasswordIconHovered = true"
          @mouseout="togglePasswordIconHovered = false"
        />
      </div>
      <div class="container d-flex gap-4 justify-content-center">
        <button
          type="submit"
          class="btn btn-outline-secondary px-5 py-2"
          :disabled="loading"
        >
          Войти
        </button>
        <button type="button" class="btn btn-link px-3 py-2">
          Забыли пароль?
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
#authContainer {
  margin-top: 150px;
  max-width: 600px;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

#authHeader {
  position: relative;
  bottom: 50px;
  left: 2rem;
  width: fit-content;
  background-color: #fff;
  margin: -25px;
}

#togglePassword {
  position: absolute;
  right: 20px;
  top: 15px;
  cursor: pointer;
}
</style>
