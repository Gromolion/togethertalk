<script setup lang="ts">
import { ref } from "vue";
import { Video } from "@/components/ChatRoom/types";

interface Props {
  video: Video;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 320,
  height: 180,
});

const width = ref(props.width);
const height = ref(props.height);

function playVideo(event: Event) {
  const eventTarget = event.target as HTMLVideoElement;
  eventTarget.play();
}

function canPlay(event: Event) {
  const eventTarget = event.target as HTMLVideoElement;
  height.value =
    (eventTarget.videoHeight / eventTarget.videoWidth) * width.value;
}
</script>

<template>
  <video
    :srcObject.prop="props.video.stream"
    :height="height"
    :width="width"
    @canplay="canPlay"
    @loadeddata="playVideo"
  ></video>
</template>

<style scoped></style>
