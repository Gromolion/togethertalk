<script setup lang="ts">
import { TypographyElements } from "@/primitives/Typography/enum.ts";
import Theme from "@/theme/theme.ts";

type Props = {
  element: TypographyElements;
  color?: string;
  hoverColor?: string;
  bold?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  element: TypographyElements.SPAN,
  color: Theme.textColors.link,
  bold: false,
});
</script>

<template>
  <component id="typography" :is="props.element" :class="{ 'fw-bold': bold }">
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

#typography:hover {
  color: v-bind("hoverColor || color");
}
</style>
