<script setup>
import UserVideo from "@/components/ChatRoom/UserVideo.vue";
import { useInitVideoChat } from "@/components/ChatRoom/hooks.ts";
import { useRoute } from "vue-router";
import { computed } from "vue";
import ConferenceActions from "@/components/ChatRoom/ConferenceActions.vue";
import ChatActions from "@/entities/chat/chatActions";
import { useStore } from "vuex";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import ChatMember from "@/components/ChatRoom/ChatMember.vue";

const route = useRoute();
const store = useStore();
const actions = new ChatActions();

const videoChat = computed(() => {
  return useInitVideoChat(route.query.roomId?.toString(), actions, store);
});
const videosLength = computed(
  () => Object.keys(videoChat.value.videos.value).length
);

const videoRowsRule = {
  1: "video-row-1",
  2: "video-row-2",
};

const inRow = computed(() =>
  Object.entries(videoRowsRule).reduce((acc, [key]) => {
    if (videosLength.value >= key) acc = key;
    return acc;
  }, 0)
);

const groupedVideos = computed(() => {
  const acc = [];
  for (let i = 0; i < videosLength.value; i += inRow.value) {
    acc.push(videoChat.value.videos.value.slice(i, i + inRow.value));
  }
  return acc;
});

const disconnect = () => {
  videoChat.value.socket.disconnect();
};
</script>

<template>
  <div
    class="container"
    :class="{
      decreased:
        videoChat.videos.value.length < 2 &&
        !actions.showChat &&
        !actions.showUsers,
    }"
  >
    <div class="chatRoom d-flex">
      <div
        class="videoGrid p-4"
        :class="{ fullWidth: !actions.showChat && !actions.showUsers }"
      >
        <div
          class="videoRow d-flex flex-wrap justify-content-between"
          v-for="(videoRow, rowIndex) in groupedVideos"
          :key="rowIndex"
        >
          <UserVideo
            v-for="(video, index) in videoRow"
            :video="video"
            :key="index"
            class="video"
            :class="videoRowsRule[inRow]"
          />
        </div>
      </div>
      <div
        class="sideBlock"
        :class="{ collapsed: !actions.showChat && !actions.showUsers }"
      >
        <div
          class="chat-container sideBlockContainer p-4"
          :class="{
            collapsed: !actions.showChat,
          }"
        >
          <TypographyText :element="TypographyElements.H4">Чат</TypographyText>
        </div>
        <div
          class="users-container sideBlockContainer p-4"
          :class="{
            collapsed: !actions.showUsers,
          }"
        >
          <TypographyText :element="TypographyElements.H4"
            >Участники</TypographyText
          >
          <ChatMember
            :video="video"
            v-for="video in videoChat.videos.value"
            :key="video.socketId"
          />
        </div>
      </div>
    </div>
    <ConferenceActions v-model="actions" @leave="disconnect" />
  </div>
</template>

<style scoped>
.container {
  margin-top: 60px;
  padding: 0 !important;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  background-color: #f8f8f8;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}

.container.decreased {
  max-width: 1000px;
}

.videoGrid {
  width: 70%;
}

.videoGrid.fullWidth {
  width: 100% !important;
}

.sideBlock {
  width: 30%;
  border-left: 1px solid #a9a9a9;
}

.sideBlock .sideBlockContainer {
  height: 100%;
}

.collapsed {
  display: none;
}

.video {
  margin-bottom: 5px;
}

.video-row-1 {
  width: 100%;
}

.video-row-2 {
  width: 49.5%;
}
</style>
