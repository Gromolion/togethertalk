<script setup lang="ts">
import { TypographyElements } from "@/primitives/Typography/enum.ts";
import Theme from "@/theme/theme.ts";

type Props = {
  element: TypographyElements;
  color: string;
};

const props = withDefaults(defineProps<Props>, {
  element: TypographyElements.SPAN,
  color: Theme.textColors.black,
});
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
