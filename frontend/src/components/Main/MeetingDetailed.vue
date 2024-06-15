<script setup lang="ts">
import BaseModal from "@/primitives/BaseModal.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import { ToastsTypes } from "@/enums/toastsTypes";
import { useStore } from "vuex";
import { MeetDetailInterface } from "@/services/api/decoders/meet/meetDetailDecoder";
import AppRoutes from "@/storage/appState/appRoutes";
import AppLink from "@/primitives/App/AppLink.vue";
import { computed } from "vue";
import AutocompleteField from "@/primitives/Input/AutocompleteField.vue";
import { AutocompleteTypes } from "@/enums/autocompleteTypes";
import * as moment from "moment-timezone";

const props = withDefaults(
  defineProps<{
    meet: MeetDetailInterface;
    withFullDate: boolean;
  }>(),
  {
    withFullDate: false,
  }
);

const emit = defineEmits([
  "close",
  "cancel",
  "addParticipant",
  "deleteParticipant",
]);

const store = useStore();
const user = computed(() => store.state.auth.user);

const handleAddParticipant = async (item) => {
  try {
    const participant = await MeetGateway.addParticipant(
      props.meet.id,
      item.id
    );
    emit("addParticipant", participant);
  } catch (e) {
    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};

const handleRemoveParticipant = async (userId) => {
  try {
    await MeetGateway.removeParticipant(props.meet.id, userId);

    emit("deleteParticipant", userId);
  } catch (e) {
    await store.dispatch("toast/new", {
      title: "Произошла ошибка",
      message: e.message,
      type: ToastsTypes.ERROR,
    });
  }
};

const excludeAutocompleteIds = computed(() =>
  props.meet.participants.map((participant) => participant.id)
);
</script>

<template>
  <BaseModal @close="$emit('close')" modal-width="840px">
    <div class="p-2">
      <div class="d-flex mb-3 justify-content-between">
        <TypographyText :element="TypographyElements.H5">
          {{ meet.theme }}
        </TypographyText>
        <TypographyText :element="TypographyElements.H5">
          {{
            withFullDate
              ? moment(meet.meetAt).format("DD.MM.YYYY") +
                " в " +
                moment(meet.meetAt).format("H:mm")
              : "В " + moment(meet.meetAt).format("H:mm")
          }}
        </TypographyText>
      </div>
      <TypographyText class="mb-3" :element="TypographyElements.P">
        Инициатор: {{ meet.initiator.firstName }} {{ meet.initiator.lastName }}
      </TypographyText>
      <TypographyText
        v-if="!!meet.description"
        class="mb-3"
        :element="TypographyElements.P"
      >
        Описание: {{ meet.description }}
      </TypographyText>
      <div class="participants mb-3">
        <TypographyText class="mb-2" :element="TypographyElements.SPAN">
          Участники:
        </TypographyText>
        <div class="row align-items-center">
          <div
            class="participant col-3"
            v-for="participant in meet.participants"
            :key="participant.id"
          >
            <TypographyText
              class="mb-1 d-flex align-items-center gap-1 participantName"
              :element="TypographyElements.P"
            >
              <i class="bi bi-person" /> {{ participant.firstName }}
              {{ participant.lastName }}
              <i
                class="bi bi-x px-1"
                @click="handleRemoveParticipant(participant.id)"
              />
            </TypographyText>
          </div>
          <AutocompleteField
            v-if="meet.participants.length < 4"
            class="autocomplete col-3 ms-auto"
            id="userAutocomplete"
            label="Пригласить"
            placeholder="Пригласить..."
            :excludeIds="excludeAutocompleteIds"
            :type="AutocompleteTypes.USER"
            @selectItem="handleAddParticipant"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <AppLink
          @click.stop
          :url="AppRoutes.getChatRoomUrl() + `?roomId=${meet.hash}`"
          class="btn btn-outline-secondary px-4 py-2"
          >Присоединиться</AppLink
        >
        <button
          v-if="user.id === meet.initiator.id"
          type="button"
          class="btn btn-outline-secondary px-4 py-2"
          @click.stop="$emit('cancel')"
        >
          Отменить
        </button>
        <button
          v-if="user.id !== meet.initiator.id"
          type="button"
          class="btn btn-outline-secondary px-4 py-2"
          @click.stop="$emit('cancel')"
        >
          Отказаться
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.bi-x {
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 50px;
}
.bi-x:hover {
  background-color: #eaeaea;
}
</style>
