<script setup lang="ts">
import { defineModel, ref, onUpdated } from "vue";

const props = withDefaults(
  defineProps<{
    className?: string;
    id: string;
    placeholder?: string;
    label?: string;
    type?: string;
    invalid?: boolean;
    autocomplete?: string;
  }>(),
  {
    type: "text",
    invalidIcon: false,
  }
);

const model = defineModel();

const firstRender = ref(true);

onUpdated(() => {
  firstRender.value = false;
});

const input = ref(null);
const onFocus = () => {
  if (props.type === "datetime-local") {
    input.value.showPicker();
  }
};
</script>

<template>
  <textarea
    v-if="type === 'textarea'"
    :class="[props.className, { invalidInput: !firstRender && invalid }]"
    :id="props.id"
    :placeholder="props.placeholder"
    v-model="model"
    :autocomplete="props.autocomplete"
  />
  <input
    :type="props.type"
    :class="[props.className, { invalidInput: !firstRender && invalid }]"
    :id="props.id"
    :placeholder="props.placeholder"
    ref="input"
    @focusin="onFocus"
    v-model="model"
    v-else
    :autocomplete="props.autocomplete"
  />
  <label :for="props.id">{{ props.label }}</label>
</template>

<style scoped>
.invalidInput {
  border-color: var(--bs-form-invalid-border-color) !important;
}
.invalidInput:focus {
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.25);
}
</style>
