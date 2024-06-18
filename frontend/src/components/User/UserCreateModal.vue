<script setup lang="ts">
import BaseModal from "@/primitives/BaseModal.vue";
import { defineModel, ref } from "vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import InputField from "@/primitives/Input/InputField.vue";
import UserModel from "@/storage/modules/user/UserModel";
import UserGateway from "@/services/api/gateway/user.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";
import { useStore } from "vuex";
import AppRoutes from "@/storage/appState/appRoutes";
import { useRouter } from "vue-router";

defineEmits(["close"]);

const store = useStore();
const router = useRouter();

const model = defineModel();
if (!model.value) {
  model.value = new UserModel();
}

const loading = ref(false);

const togglePassword = ref(false);
const togglePasswordIconHovered = ref(false);

const onSubmit = async () => {
  if (!model.value.isValid) {
    console.log(model.validationResult);
    return;
  }

  try {
    loading.value = true;

    await UserGateway.create(model.value);

    await router.push({ path: AppRoutes.getUsersUrl() });
    router.go();
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
  <BaseModal class="meetModal" @close="$emit('close')">
    <TypographyText class="mb-4 text-center" :element="TypographyElements.H5">
      Регистрация пользователя
    </TypographyText>
    <form @submit.prevent="onSubmit">
      <div class="d-flex gap-3 mb-4">
        <div class="form-floating">
          <InputField
            id="loginInput"
            v-model="model.login"
            class-name="form-control"
            placeholder="Логин"
            label="Логин"
            :invalid="!!model.validationResult.causes.login"
          />
        </div>
        <div class="form-floating">
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
      </div>
      <div class="d-flex gap-3 mb-4">
        <div class="form-floating">
          <InputField
            id="firstNameInput"
            v-model="model.firstName"
            class-name="form-control"
            placeholder="Имя"
            label="Имя"
            :invalid="!!model.validationResult.causes.firstName"
          />
        </div>
        <div class="form-floating">
          <InputField
            id="lastNameInput"
            v-model="model.lastName"
            class-name="form-control"
            placeholder="Фамилия"
            label="Фамилия"
            :invalid="!!model.validationResult.causes.lastName"
          />
        </div>
      </div>
      <div class="d-flex gap-3 mb-4">
        <div class="form-floating">
          <InputField
            id="emailInput"
            v-model="model.email"
            class-name="form-control"
            placeholder="Почта"
            label="Почта"
            :invalid="!!model.validationResult.causes.email"
          />
        </div>
        <div class="form-floating">
          <InputField
            id="positionInput"
            v-model="model.position"
            class-name="form-control"
            placeholder="Должность"
            label="Должность"
            :invalid="!!model.validationResult.causes.position"
          />
        </div>
      </div>
      <div class="container d-flex justify-content-center">
        <button
          type="submit"
          class="btn btn-outline-secondary px-5 py-2"
          :disabled="loading"
        >
          Зарегистрировать
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
#togglePassword {
  position: absolute;
  right: 20px;
  top: 15px;
  cursor: pointer;
}
</style>
