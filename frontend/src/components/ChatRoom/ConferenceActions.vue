<script setup lang="ts">
import { defineModel } from "vue";
import ChatActions from "@/entities/chat/chatActions";

const actions = defineModel({ required: true, type: ChatActions });
</script>

<template>
  <div class="actions d-flex px-5 py-2 justify-content-center gap-3">
    <button
      type="button"
      id="showChat"
      @click="actions.showChat = !actions.showChat"
      :class="{ active: actions.showChat }"
    >
      <i class="bi bi-chat" />
    </button>
    <button
      type="button"
      id="showUsers"
      @click="actions.showUsers = !actions.showUsers"
      :class="{ active: actions.showUsers }"
    >
      <i class="bi bi bi-people" />
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

button:hover {
  background-color: #cecece;
}

button.active {
  border: 2px inset #a9a9a9;
}

i {
  font-size: 1.5rem;
}
</style>
