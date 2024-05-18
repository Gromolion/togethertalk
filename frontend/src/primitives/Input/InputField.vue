<script setup lang="ts">
import { defineModel, ref, onUpdated } from "vue"

const props = withDefaults(defineProps<{
  className?: string;
  id: string;
  placeholder?: string;
  label?: string;
  type?: string;
  invalid?: boolean;
  autocomplete?: string;
}>(), {
  type: "text",
  invalidIcon: false,
});

const model = defineModel();

const firstRender = ref(true);

onUpdated(() => {
  firstRender.value = false;
})
</script>

<template>
  <input :type="props.type" :class="[props.className, {'invalidInput': !firstRender && invalid}]" :id="props.id"
         :placeholder="props.placeholder" v-model="model"
         :autocomplete="props.autocomplete">
  <label :for="props.id">{{ props.label }}</label>
</template>

<style scoped>
.invalidInput {
  border-color: var(--bs-form-invalid-border-color) !important;
}
.invalidInput:focus {
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-danger-rgb),.25);
}
</style>