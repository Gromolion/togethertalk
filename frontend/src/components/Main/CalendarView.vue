<script setup lang="ts">
import MeetingCard from "@/components/Main/MeetingCard.vue";
import DatePicker from "@/primitives/Calendar/DatePicker.vue";
import { ref, watch } from "vue";
import moment from "moment-timezone";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import PlanMeetingModal from "@/components/Main/PlanMeetingModal.vue";

const selectedDate = ref(null);
const onCalendarSelect = (date) => (selectedDate.value = date);

const showPlanModal = ref(false);
const list = ref([]);

watch(selectedDate, (date) => {
  MeetGateway.listForDate(moment(date).format("YYYY-MM-DD"), 1, 10).then(
    (res) =>
      (list.value = res.sort(
        (meet1, meet2) =>
          moment(meet1.meetAt).unix() - moment(meet2.meetAt).unix()
      ))
  );
});

const onAdd = (meet) => {
  list.value.push(meet);
  showPlanModal.value = false;
};

const onCancel = (id) => {
  list.value = list.value.filter((meet) => meet.id !== id);
};
const onChange = (source) => {
  const target = list.value.find((meet) => meet.id === source.id);
  Object.assign(target, source);
};
</script>

<template>
  <div class="d-flex justify-content-between">
    <DatePicker class="viewBlock" @select="onCalendarSelect" />
    <div class="viewBlock">
      <div class="text-end">
        <button
          type="button"
          class="btn btn-outline-secondary px-5 py-2"
          @click="showPlanModal = true"
        >
          Запланировать
        </button>
      </div>
      <div class="list d-flex flex-wrap mt-4">
        <MeetingCard
          class="meetingCard"
          v-for="meet in list"
          :key="meet.id"
          :meet="meet"
          @cancel="onCancel"
          @change="onChange"
        />
      </div>
    </div>
    <PlanMeetingModal
      v-if="showPlanModal"
      @close="showPlanModal = false"
      @added="onAdd"
    />
  </div>
</template>

<style scoped>
.viewBlock {
  width: 47%;
}

.list {
  justify-content: safe start;
}

.meetingCard {
  width: 49%;
  margin: 0 0.5% 10px;
}
</style>
