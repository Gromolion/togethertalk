<script setup lang="ts">
const props = defineProps<{
  type: string,
  fill?: string,
  stroke?: string,
}>();

const src = `${window.location.origin}/assets/icons/${props.type}`;
</script>

<template>
  <img alt="" :src="src" />
</template>

<style scoped>
 img {
   fill: v-bind('fill');
   stroke: v-bind('stroke');
 }
</style>