<script setup lang="ts">
import { Video } from "@/components/ChatRoom/types";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";

const props = defineProps<{
  video: Video;
}>();

function playVideo(event: Event) {
  const eventTarget = event.target as HTMLVideoElement;
  eventTarget.play();
}
</script>

<template>
  <div class="position-relative">
    <video :srcObject="props.video.stream" @loadeddata="playVideo" />
    <TypographyText
      class="userName"
      :element="TypographyElements.H4"
      color="white"
    >
      {{
        `${props.video.user?.firstName} ${props.video.user?.lastName
          .charAt(0)
          .toUpperCase()}.`
      }}
    </TypographyText>
  </div>
</template>

<style scoped>
video {
  background-color: black;
  width: 100%;
  border-radius: 15px;
  -webkit-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 14px 14px 20px 0 rgba(0, 0, 0, 0.1);
  transform: rotateY(180deg);
}

.userName {
  position: absolute;
  display: block;
  right: 20px;
  top: 20px;
}
</style>
