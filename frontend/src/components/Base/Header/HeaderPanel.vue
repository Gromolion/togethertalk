<script setup lang="ts">
import LogoLink from "@/components/Base/Header/LogoText.vue";
import HeaderLinks from "@/components/Base/Header/HeaderLinks.vue";
</script>

<template>
  <div id="header-panel-container">
    <div id="header-panel-content">
      <LogoLink />
      <HeaderLinks />
    </div>
  </div>
</template>

<style scoped>
#header-panel-container {
  display: flex;
  padding: 10px 60px;
}
#header-panel-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
