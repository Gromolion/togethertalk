<script setup lang="ts">
import MeetingCard from "@/components/Main/MeetingCard.vue";
import PlanMeetingModal from "@/components/Main/PlanMeetingModal.vue";
import { computed, ref, watch, watchEffect } from "vue";
import moment from "moment-timezone";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import PaginationBar from "@/primitives/Pagination/PaginationBar.vue";
import { usePagination } from "@/primitives/Pagination/hooks";

const showPlanModal = ref(false);
const currentDate = moment().format("YYYY-MM-DD HH:mm");
const list = ref([]);
const totalCount = ref(0);

const pagination = computed(() => usePagination(8));

watch(
  pagination,
  ({ currentPage, perPage }) => {
    MeetGateway.listForDate(currentDate, currentPage.value, perPage.value).then(
      (res) => {
        list.value = res.list;
        totalCount.value = res.totalCount;
      }
    );
  },
  { immediate: true, deep: true }
);

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
    <div
      class="meetingCard"
      v-for="meet in list.sort(
        (meet1, meet2) =>
          moment(meet1.meetAt).unix() - moment(meet2.meetAt).unix()
      )"
      :key="meet.id"
    >
      <MeetingCard :meet="meet" @cancel="onCancel" @change="onChange" />
    </div>
  </div>
  <PaginationBar :totalCount="totalCount" :perPageMultiplier="8" />
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
