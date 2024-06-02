<script setup lang="ts">
import { defineModel } from "vue";
import ChatActions from "@/entities/chat/chatActions";
import { useRouter } from "vue-router";
import AppRoutes from "@/storage/appState/appRoutes";

const actions = defineModel({ required: true, type: ChatActions });

const router = useRouter();

const emit = defineEmits(["leave"]);

const handleLeave = () => {
  emit("leave");
  router.push(AppRoutes.getMainUrl());
};
</script>

<template>
  <div class="actions d-flex px-5 py-2 justify-content-center gap-3">
    <button
      type="button"
      id="enableVideo"
      @click="actions.toggleVideo"
      class="enableTrackButton"
      :class="{ active: !actions.enableVideo }"
    >
      <i class="bi bi-camera-video" />
    </button>
    <button
      type="button"
      id="enableAudio"
      @click="actions.toggleAudio"
      class="enableTrackButton"
      :class="{ active: !actions.enableAudio }"
    >
      <i class="bi bi-mic" />
    </button>
    <button
      type="button"
      id="enableDemonstration"
      @click="actions.toggleDemonstration"
      :class="{ active: actions.enableDemonstration }"
    >
      <i class="bi bi-display" />
    </button>
    <button
      type="button"
      id="showChat"
      @click="actions.toggleChat"
      :class="{ active: actions.showChat }"
    >
      <i class="bi bi-chat" />
    </button>
    <button
      type="button"
      id="showUsers"
      @click="actions.toggleUsers"
      :class="{ active: actions.showUsers }"
    >
      <i class="bi bi bi-people" />
    </button>
    <button type="button" id="leave" @click="handleLeave" class="px-3">
      Выйти
    </button>
  </div>
</template>

<style scoped>
.actions {
  border-top: 1px solid #a9a9a9;
}

button {
  width: 60px;
  height: 60px;
  border: 1px solid #a9a9a9;
  border-radius: 10px;
  background-color: #ececec;
}

.enableTrackButton.active {
  background-color: #e55555;
  border: 2px inset red;
}

button:hover {
  background-color: #cecece;
}

button.active {
  border: 2px inset #a9a9a9;
}

#enableDemonstration.active {
  background-color: #87ff67;
  border: 1px solid #56a640;
}

#leave {
  background-color: #e55555;
  border: 1px solid red;
  width: auto;
  height: auto;
  margin-left: auto;
}
#leave:hover {
  background-color: #c74a4a;
}

i {
  font-size: 1.5rem;
}
</style>
