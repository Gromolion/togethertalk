<script setup lang="ts">
import MeetingCard from "@/components/Main/MeetingCard.vue";
import DatePicker from "@/primitives/Calendar/DatePicker.vue";
import { computed, ref, watch } from "vue";
import moment from "moment-timezone";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import PlanMeetingModal from "@/components/Main/PlanMeetingModal.vue";
import { usePagination } from "@/primitives/Pagination/hooks";
import PaginationBar from "@/primitives/Pagination/PaginationBar.vue";

const selectedDate = ref(null);
const onCalendarSelect = (date) => (selectedDate.value = date);

const showPlanModal = ref(false);
const list = ref([]);
const totalCount = ref(0);

const pagination = computed(() => usePagination(4));

watch(
  () => [selectedDate, pagination],
  ([date, pagination]) => {
    MeetGateway.listForDate(
      moment(date.value).format("YYYY-MM-DD"),
      pagination.value.currentPage.value,
      pagination.value.perPage.value
    )
      .then((res) => {
        list.value = res.list.sort(
          (meet1, meet2) =>
            moment(meet1.meetAt).unix() - moment(meet2.meetAt).unix()
        );
        totalCount.value = res.totalCount;
      })
      .catch(() => (list.value = []));
  },
  {
    deep: true,
  }
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
      <PaginationBar :totalCount="totalCount" :perPageMultiplier="4" />
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
