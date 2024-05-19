<script setup>
import UserVideo from "@/components/ChatRoom/UserVideo.vue";
import { useInitVideoChat } from "@/components/ChatRoom/hooks.ts";
import { useRoute } from "vue-router";
import { computed, reactive } from "vue";
import ConferenceActions from "@/components/ChatRoom/ConferenceActions.vue";
import ChatActions from "@/entities/chat/chatActions";

const route = useRoute();

const videos = useInitVideoChat(route.query.roomId?.toString());
const videosLength = computed(() => Object.keys(videos.value).length);

const videoRowsRule = {
  1: "video-row-1",
  2: "video-row-2",
  5: "video-row-5",
};

const inRow = computed(() =>
  Object.entries(videoRowsRule).reduce((acc, [key]) => {
    console.log(videosLength.value);
    if (videosLength.value >= key) acc = key;
    return acc;
  }, 0)
);

const groupedVideos = computed(() => {
  const acc = [];
  for (let i = 0; i < videosLength.value; i += inRow.value) {
    acc.push(videos.value.slice(i, i + inRow.value));
  }
  return acc;
});

const actions = new ChatActions();
</script>

<template>
  <div class="container">
    <div class="chatRoom d-flex">
      <div ref="videoGrid" class="video-grid p-4">
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
      <div class="sideBlock">
        <div
          class="chat-container sideBlockContainer"
          :class="{
            collapsed: !actions.showChat,
            halfHeight: actions.showChat && actions.showUsers,
          }"
        ></div>
        <div
          class="users-container sideBlockContainer"
          :class="{
            collapsed: !actions.showUsers,
            halfHeight: actions.showChat && actions.showUsers,
          }"
        ></div>
      </div>
    </div>
    <ConferenceActions v-model="actions" />
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

.sideBlock {
  width: 30%;
  border-left: 1px solid #a9a9a9;
}

.sideBlock .sideBlockContainer {
  height: 100%;
}

.sideBlock .halfHeight {
  height: 50% !important;
}

.chat-container {
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

.video-row-5 {
  width: 24%;
}
</style>
