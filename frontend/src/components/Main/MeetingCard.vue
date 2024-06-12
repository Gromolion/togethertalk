<script setup lang="ts">
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import * as moment from "moment-timezone";
import { useStore } from "vuex";
import { computed, defineAsyncComponent, ref } from "vue";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";
import AppRoutes from "@/storage/appState/appRoutes";
import AppLink from "@/primitives/App/AppLink.vue";
import PlanMeetingModal from "@/components/Main/PlanMeetingModal.vue";
import MeetModel from "@/storage/modules/meet/MeetModel";
import { MeetDetailInterface } from "@/services/api/decoders/meet/meetDetailDecoder";

const props = defineProps<{
  meet: MeetDetailInterface;
}>();

const meeting = ref(props.meet);

const emit = defineEmits(["cancel", "change"]);

const store = useStore();

const user = computed(() => store.state.auth.user);

const detailModalOpened = ref(false);

const DetailAsyncModal = defineAsyncComponent(
  () => import("@/components/Main/MeetingDetailed.vue")
);

const showUpdateModal = ref(false);
const meetModel = MeetModel.fromMeet(meeting.value);

const handleCancel = async () => {
  try {
    await MeetGateway.cancel(meeting.value.id);

    emit("cancel", meeting.value.id);
  } catch (e) {
    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};
const handleAdd = (meet) => {
  emit("change", meet);
  showUpdateModal.value = false;
};

const handleAddParticipant = (user) => {
  meeting.value.participants.push(user);
};

const handleRemoveParticipant = (id) => {
  meeting.value.participants = meeting.value.participants.filter(
    (user) => user.id !== id
  );
};
</script>

<template>
  <div class="meet p-4" @click="detailModalOpened = true">
    <TypographyText color="#000206" :element="TypographyElements.H5">
      {{ meeting.theme }}
    </TypographyText>
    <TypographyText
      class="mt-3"
      color="#000206"
      :element="TypographyElements.P"
    >
      Инициатор:
      {{ `${meeting.initiator.firstName} ${meeting.initiator.lastName}` }}
    </TypographyText>
    <TypographyText
      class="mt-2"
      color="#000206"
      :element="TypographyElements.P"
    >
      Участников: {{ meeting.participants.length }}
    </TypographyText>

    <TypographyText
      class="mt-2 text-end"
      color="#000206"
      :element="TypographyElements.P"
    >
      В {{ moment(meeting.meetAt).format("H:mm") }}
    </TypographyText>
    <div class="d-flex flex-column gap-2 mt-3">
      <AppLink
        @click.stop
        :url="AppRoutes.getChatRoomUrl() + `?roomId=${meeting.hash}`"
        class="btn btn-outline-secondary p-1"
        >Присоединиться</AppLink
      >
      <button
        @click.stop="showUpdateModal = true"
        v-if="user.id === meeting.initiator.id"
        type="button"
        class="btn btn-outline-secondary p-1"
      >
        Редактировать
      </button>
      <button
        v-if="user.id === meeting.initiator.id"
        type="button"
        class="btn btn-outline-secondary p-1"
        @click.stop="handleCancel"
      >
        Отменить
      </button>
      <button
        v-if="user.id !== meeting.initiator.id"
        type="button"
        class="btn btn-outline-secondary p-1"
        @click.stop="handleCancel"
      >
        Отказаться
      </button>
    </div>
  </div>
  <Suspense>
    <DetailAsyncModal
      v-if="detailModalOpened"
      :meet="meeting"
      @close="detailModalOpened = false"
      @cancel="handleCancel"
      @addParticipant="handleAddParticipant"
      @deleteParticipant="handleRemoveParticipant"
    />
  </Suspense>
  <PlanMeetingModal
    v-if="showUpdateModal"
    @close="showUpdateModal = false"
    @added="handleAdd"
    v-model="meetModel"
  />
</template>

<style scoped>
.meet {
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

.meet:hover:not(:has(button:hover)) {
  background-color: #e7e7e7;
  cursor: pointer;
}
</style>
