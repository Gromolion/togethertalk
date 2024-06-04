<script setup lang="ts">
import { computed, ref } from "vue";
import InputField from "@/primitives/Input/InputField.vue";
import { useStore } from "vuex";
import { ToastsTypes } from "@/enums/toastsTypes";
import { useRoute, useRouter } from "vue-router";
import AppRoutes from "@/storage/appState/appRoutes";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";

const store = useStore();
const router = useRouter();
const route = useRoute();

const hash = computed(() => route.params.hash);
const password = ref(null);

const loading = ref(false);

const togglePassword = ref(false);
const togglePasswordIconHovered = ref(false);

const handleSubmit = async () => {
  if (!password.value) return;

  loading.value = true;

  try {
    await store.dispatch("auth/resetPasswordByHash", {
      hash: hash.value,
      password: password.value,
    });

    loading.value = false;

    await router.push({ path: AppRoutes.getAuthorizationUrl() });

    await store.dispatch("toast/new", {
      message: "Пароль изменен",
      type: ToastsTypes.SUCCESS,
    });
  } catch (e) {
    loading.value = false;

    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};
</script>

<template>
  <div class="container pt-5 px-5 pb-4" id="authContainer">
    <TypographyText
      id="authHeader"
      class="display-6"
      :element="TypographyElements.H5"
    >
      Авторизация
    </TypographyText>
    <form @submit.prevent="handleSubmit">
      <div class="form-floating mb-4 d-flex">
        <InputField
          id="passwordInput"
          v-model="password"
          class-name="form-control"
          placeholder="Новый пароль"
          label="Новый пароль"
          :invalid="!password"
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
      <div class="container d-flex justify-content-center">
        <button
          type="submit"
          class="btn btn-outline-secondary px-5 py-2"
          :disabled="loading"
        >
          <TypographyText :element="TypographyElements.SPAN">
            Сменить пароль
          </TypographyText>
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
