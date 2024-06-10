<script setup lang="ts">
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { computed, ref } from "vue";
import moment, { Moment } from "moment-timezone";
import { capitalizeFirst } from "@/utils/text";

const emit = defineEmits(["select"]);

const selectedDate = ref(moment().locale("ru"));
emit("select", selectedDate.value);

const calendarHeader = computed(() =>
  capitalizeFirst(selectedDate.value.format("MMMM YYYY"))
);

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const days: Moment[] = computed(() => {
  const start = selectedDate.value.clone().startOf("month").startOf("week");
  const end = selectedDate.value.clone().endOf("month").endOf("week");

  let daysList = [];
  while (start <= end) {
    daysList.push(start.clone());
    start.add(1, "day");
  }

  return daysList;
});

const onSelectDate = (date: Moment) => {
  selectedDate.value = date;
  emit("select", selectedDate.value);
};
</script>

<template>
  <div class="viewBlock calendar">
    <div
      class="d-flex justify-content-between align-items-center viewBlock calendarHeader w-100"
    >
      <TypographyText color="#000206" :element="TypographyElements.H5" bold>{{
        calendarHeader
      }}</TypographyText>
      <div class="d-flex gap-2">
        <button
          @click="selectedDate = selectedDate.clone().subtract(1, 'months')"
        >
          <i class="bi bi-chevron-up fw-bold" />
        </button>
        <button @click="selectedDate = selectedDate.clone().add(1, 'months')">
          <i class="bi bi-chevron-down fw-bold" />
        </button>
      </div>
    </div>
    <div class="bodyHeader d-flex">
      <div class="calendarDay p-3" v-for="day in weekDays" :key="day">
        <TypographyText color="#000206" :element="TypographyElements.SPAN" bold>
          {{ day }}
        </TypographyText>
      </div>
    </div>
    <div class="body d-flex flex-wrap">
      <div
        class="calendarDay p-3"
        :class="{ currentDay: selectedDate.format('L') === date.format('L') }"
        v-for="date in days"
        @click="onSelectDate(date)"
        :key="date.format('L')"
      >
        <TypographyText
          :color="selectedDate.month() !== date.month() ? '#989595' : '#000206'"
          :element="TypographyElements.SPAN"
          bold
        >
          {{ date.date() }}
        </TypographyText>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendarHeader button {
  background-color: #fff;
  border: none;
  border-radius: 10px;
  width: 48px;
  height: 48px;
}

.calendarHeader button:hover {
  background-color: #e8e7e7ff;
}

.calendarDay {
  width: 14.2857%;
  text-align: center;
  border-radius: 15px;
}

.body .calendarDay:hover {
  background-color: #e8e7e7ff;
  cursor: pointer;
}

.body .calendarDay.currentDay {
  border: 2px solid black;
}
</style>
