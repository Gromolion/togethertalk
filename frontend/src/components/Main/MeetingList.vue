<script setup lang="ts">
import MeetingCard from "@/components/Main/MeetingCard.vue";
import PlanMeetingModal from "@/components/Main/PlanMeetingModal.vue";
import { ref } from "vue";
import moment from "moment-timezone";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";

const showPlanModal = ref(false);
const currentDate = moment().format("YYYY-MM-DD");
const list = ref([]);

MeetGateway.listForDate(currentDate, 1, 10).then(
  (res) =>
    (list.value = res.sort(
      (meet1, meet2) =>
        moment(meet1.meetAt).unix() - moment(meet2.meetAt).unix()
    ))
);

const onAdd = (meet) => {
  list.value.push(meet);
  showPlanModal.value = false;
};
</script>

<template>
  <div style="text-align: right">
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
      :theme="meet.theme"
      :initiator="meet.initiator"
      :participants="meet.participantsCount"
      :meetAt="moment(meet.meetAt)"
    />
  </div>
  <PlanMeetingModal
    v-if="showPlanModal"
    @close="showPlanModal = false"
    @added="onAdd"
  />
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
