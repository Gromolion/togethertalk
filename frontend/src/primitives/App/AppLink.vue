<script setup lang="ts">
const props = defineProps<{
  url: string;
}>();
</script>

<template>
  <router-link class="router-link" :to="props.url">
    <slot />
  </router-link>
</template>

<style scoped>
.router-link {
  text-decoration: none;
}
</style>
