<script setup lang="ts">
import { TypographyElements } from "@/components/Base/Typography/enum";

const props = withDefaults(
  defineProps<{
    element: TypographyElements;
    color: string;
  }>(),
  {
    element: TypographyElements.SPAN,
    color: "black",
  }
);
</script>

<template>
  <component id="typography" :is="props.element">
    <slot></slot>
  </component>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

#typography {
  font-family: "Montserrat", serif;
  margin: 0;
  color: v-bind(color);
}
</style>
