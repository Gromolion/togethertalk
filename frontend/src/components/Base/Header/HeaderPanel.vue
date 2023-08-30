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
  height: 60px;
  background: #6c5285;
  display: flex;
  padding: 0 60px;
  -webkit-box-shadow: 0 18px 9px 4px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 18px 9px 4px rgba(0, 0, 0, 0.5);
  box-shadow: 0 18px 9px 4px rgba(0, 0, 0, 0.5);
}
#header-panel-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
