<script setup lang="ts">
import BaseModal from "@/primitives/BaseModal.vue";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import InputField from "@/primitives/Input/InputField.vue";
import MeetModel from "@/storage/modules/meet/MeetModel";
import { ref } from "vue";
import { ToastsTypes } from "@/enums/toastsTypes";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import { useStore } from "vuex";

const emit = defineEmits(["close", "added"]);

const store = useStore();

const model = new MeetModel();
const loading = ref(false);

const onSubmit = async () => {
  if (!model.isValid) return;

  try {
    const meet = await MeetGateway.create(model);

    loading.value = false;

    emit("added", meet);
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
  <BaseModal class="meetModal" modalWidth="800px" @close="$emit('close')">
    <TypographyText class="mb-4 text-center" :element="TypographyElements.H5">
      Планирование встречи
    </TypographyText>
    <form @submit.prevent="onSubmit">
      <div class="form-floating mb-4">
        <InputField
          id="themeInput"
          v-model="model.theme"
          class-name="form-control"
          placeholder="Тема"
          label="Тема"
          :invalid="!!model.validationResult.causes.theme"
        />
      </div>
      <div class="form-floating mb-4">
        <InputField
          id="descriptionInput"
          v-model="model.description"
          type="textarea"
          class-name="form-control"
          placeholder="Описание"
          label="Описание"
          :invalid="!!model.validationResult.causes.description"
        />
      </div>
      <div class="form-floating mb-4">
        <InputField
          id="descriptionInput"
          v-model="model.dateTime"
          class-name="form-control datepicker"
          type="datetime-local"
          placeholder="Дата и время"
          label="Дата и время"
          :invalid="!!model.validationResult.causes.dateTime"
        />
      </div>
      <div class="container d-flex justify-content-center">
        <button
          type="submit"
          class="btn btn-outline-secondary px-5 py-2"
          :disabled="loading"
        >
          Запланировать
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped></style>
