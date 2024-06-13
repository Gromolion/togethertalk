--
<script setup lang="ts">
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import AppRoutes from "@/storage/appState/appRoutes";
import Theme from "@/theme/theme";
import AppLink from "@/primitives/App/AppLink.vue";
import MeetingList from "@/components/Main/MeetingList.vue";
import CalendarView from "@/components/Main/CalendarView.vue";

const router = useRouter();
const listSelected = computed(
  () => router.currentRoute.value.path === AppRoutes.getMainUrl()
);
</script>

<template>
  <div class="container p-4">
    <div id="tabs">
      <AppLink :url="AppRoutes.getMainUrl()">
        <TypographyText
          class="tab"
          :element="TypographyElements.H4"
          :hoverColor="Theme.textColors.linkHover"
          :class="{ currentTab: listSelected }"
        >
          Предстоящие встречи
        </TypographyText>
      </AppLink>
      <AppLink :url="AppRoutes.getMainCalendarUrl()">
        <TypographyText
          class="tab"
          :element="TypographyElements.H4"
          :hoverColor="Theme.textColors.linkHover"
          :class="{
            currentTab: !listSelected,
          }"
        >
          Календарь встреч
        </TypographyText>
      </AppLink>
    </div>
    <MeetingList v-if="listSelected" />
    <CalendarView v-else />
  </div>
</template>

<style scoped>
.container {
  margin-top: 50px;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

#tabs {
  display: flex;
  gap: 8px;
  position: relative;
  bottom: 25px;
  left: 20px;
  margin: -15px;
}

.tab {
  background-color: #fff;
}

.currentTab {
  color: #000206 !important;
  cursor: default;
}
</style>
