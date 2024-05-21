<script setup lang="ts">
import { computed, defineProps } from "vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { Video } from "@/components/ChatRoom/types";

const props = defineProps<{
  video: Video;
}>();

const enableVideo = computed(() => props.video.enableVideo);
const enableAudio = computed(() => props.video.enableAudio);
</script>

<template>
  <TypographyText :element="TypographyElements.P"
    ><i class="bi bi-person" />
    {{ video.user.firstName + " " + video.user.lastName
    }}<i
      class="bi mx-2"
      :class="[enableVideo ? 'bi-camera-video' : 'bi-camera-video-off']" /><i
      class="bi"
      :class="[enableAudio ? 'bi-mic' : 'bi-mic-mute']"
  /></TypographyText>
</template>
