<script setup lang="ts">
import MeetingCard from "@/components/Main/MeetingCard.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
</script>

<template>
  <div style="text-align: right">
    <button type="button" class="btn btn-outline-secondary px-5 py-2">
      <TypographyText color="#000206" :element="TypographyElements.SPAN">
        Запланировать
      </TypographyText>
    </button>
  </div>
  <div class="list d-flex flex-wrap mt-4">
    <MeetingCard class="meetingCard" />
    <MeetingCard class="meetingCard" />
    <MeetingCard class="meetingCard" />
    <MeetingCard class="meetingCard" />
    <MeetingCard class="meetingCard" />
    <MeetingCard class="meetingCard" />
    <MeetingCard class="meetingCard" />
  </div>
</template>

<style scoped>
.list {
  justify-content: safe start;
}

.meetingCard {
  width: 24%;
  margin: 0 0.5% 10px;
}
</style>
