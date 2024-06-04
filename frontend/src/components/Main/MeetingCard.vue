<script setup lang="ts">
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
</script>

<template>
  <div class="meet p-4">
    <TypographyText color="#000206" :element="TypographyElements.H5">
      Тема встречи
    </TypographyText>
    <TypographyText
      class="mt-3"
      color="#000206"
      :element="TypographyElements.P"
    >
      Инициатор: Юрий Смирнов
    </TypographyText>
    <TypographyText
      class="mt-2"
      color="#000206"
      :element="TypographyElements.P"
    >
      Участников: 5
    </TypographyText>

    <TypographyText
      class="mt-2 text-end"
      color="#000206"
      :element="TypographyElements.P"
    >
      В 14:15
    </TypographyText>
    <div class="d-flex justify-content-end gap-5 mt-3">
      <button type="button" class="btn btn-outline-secondary px-3 py-2">
        Редактировать
      </button>
    </div>
  </div>
</template>

<style scoped>
.meet {
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

.meet:hover:not(:has(button:hover)) {
  background-color: #e7e7e7;
  cursor: pointer;
}
</style>
