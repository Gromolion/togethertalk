<template>
  <div ref="videoGrid" class="video-grid">
    <UserVideo
      v-for="(video, index) in videos"
      :video="video"
      :key="index"
    ></UserVideo>
  </div>
</template>

<script setup>
import UserVideo from "@/components/ChatRoom/UserVideo.vue";
import { useInitVideoChat } from "@/components/ChatRoom/hooks.ts";
import { useRoute } from "vue-router";

const route = useRoute();

const videos = useInitVideoChat(route.query.roomId);
</script>
