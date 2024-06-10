<script setup lang="ts">
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";
import { Moment } from "moment";
import { useStore } from "vuex";
import { computed } from "vue";

const props = defineProps<{
  theme: string;
  initiator: UserInterface;
  participants: number;
  meetAt: Moment;
}>();

const store = useStore();

const user = computed(() => store.state.auth.user);
</script>

<template>
  <div class="meet p-4">
    <TypographyText color="#000206" :element="TypographyElements.H5">
      {{ theme }}
    </TypographyText>
    <TypographyText
      class="mt-3"
      color="#000206"
      :element="TypographyElements.P"
    >
      Инициатор: {{ `${initiator.firstName} ${initiator.lastName}` }}
    </TypographyText>
    <TypographyText
      class="mt-2"
      color="#000206"
      :element="TypographyElements.P"
    >
      Участников: {{ participants }}
    </TypographyText>

    <TypographyText
      class="mt-2 text-end"
      color="#000206"
      :element="TypographyElements.P"
    >
      В {{ meetAt.format("H:mm") }}
    </TypographyText>
    <div class="d-flex flex-column gap-2 mt-3">
      <button type="button" class="btn btn-outline-secondary p-1">
        Присоединиться
      </button>
      <button type="button" class="btn btn-outline-secondary p-1">
        Редактировать
      </button>
    </div>
  </div>
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
