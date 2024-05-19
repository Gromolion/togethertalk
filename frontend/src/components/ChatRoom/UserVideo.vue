<script setup lang="ts">
import { ref } from "vue";
import { Video } from "@/components/ChatRoom/types";

interface Props {
  video: Video;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  // width: 320,
  // height: 180,
});

// const width = ref(props.width);
// const height = ref(props.height);

function playVideo(event: Event) {
  const eventTarget = event.target as HTMLVideoElement;
  eventTarget.play();
}

function canPlay(event: Event) {
  const eventTarget = event.target as HTMLVideoElement;
  // height.value =
  //   (eventTarget.videoHeight / eventTarget.videoWidth) * width.value;
}
</script>

<template>
  <video
    :srcObject.prop="props.video.stream"
    @canplay="canPlay"
    @loadeddata="playVideo"
  ></video>
</template>

<style scoped>
video {
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
}
</style>
