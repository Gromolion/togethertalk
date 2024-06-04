<script setup lang="ts">
import { ref } from "vue";
import InputField from "@/primitives/Input/InputField.vue";
import { useStore } from "vuex";
import { ToastsTypes } from "@/enums/toastsTypes";
import { useRouter } from "vue-router";
import AppRoutes from "@/storage/appState/appRoutes";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";

const store = useStore();
const router = useRouter();

const login = ref(null);

const loading = ref(false);

const handleSubmit = async () => {
  if (!login.value) return;

  loading.value = true;

  try {
    const hash = await store.dispatch("auth/resetPassword", login.value);

    loading.value = false;

    await router.push({
      name: "resetPasswordByHash",
      params: { hash: hash },
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
      <div class="form-floating mb-4">
        <InputField
          id="loginInput"
          v-model="login"
          class-name="form-control"
          placeholder="Логин"
          label="Логин"
          :invalid="!login"
          autocomplete="username"
        />
      </div>
      <div class="container d-flex justify-content-center">
        <button
          type="submit"
          class="btn btn-outline-secondary px-5 py-2"
          :disabled="loading"
        >
          <TypographyText :element="TypographyElements.SPAN">
            Восстановить доступ
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
</style>
