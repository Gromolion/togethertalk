<script setup lang="ts">
withDefaults(
  defineProps<{
    modalWidth?: string;
  }>(),
  {
    modalWidth: "max-content",
  }
);

defineEmits(["close"]);
</script>

<template>
  <div
    class="background d-flex align-items-center"
    @click.self="$emit('close')"
  >
    <div class="container p-4">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-color: rgba(91, 91, 91, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.container {
  border: 1px solid #000000;
  border-radius: 15px;
  background-color: #fff;
  width: v-bind(modalWidth);
}
</style>
