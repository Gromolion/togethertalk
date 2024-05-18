<script setup lang="ts">
defineProps<{
  type: string,
  fill?: string,
  stroke?: string,
}>();
</script>

<template>
  <img alt="" :src="`${window.location.origin}/assets/icons${props.type}`" />
</template>

<style scoped>
 img {
   fill: v-bind('fill');
   stroke: v-bind('stroke');
 }
</style>