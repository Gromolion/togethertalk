<script setup lang="ts">
import UserVideo from "@/components/ChatRoom/UserVideo.vue";
import { useInitVideoChat } from "@/components/ChatRoom/hooks.ts";
import { useRoute, useRouter } from "vue-router";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import ConferenceActions from "@/components/ChatRoom/ConferenceActions.vue";
import ChatActions from "@/entities/chat/chatActions";
import { useStore } from "vuex";
import TypographyText from "@/primitives/Typography/TypographyText.vue";
import { TypographyElements } from "@/primitives/Typography/enum";
import ChatMember from "@/components/ChatRoom/ChatMember.vue";
import { MeetGateway } from "@/services/api/gateway/meet.gateway";
import InputField from "@/primitives/Input/InputField.vue";
import moment from "moment-timezone";
import { ToastsTypes } from "@/enums/toastsTypes";
import { prepareFileUploader } from "@/utils/request/prepareFileUploader";
import UserGateway from "@/services/api/gateway/user.gateway";
import AppRoutes from "@/storage/appState/appRoutes";
import { convertFileToBase64 } from "@/utils/file";

const route = useRoute();
const router = useRouter();
const store = useStore();
const actions = new ChatActions();

const roomId = route.query.roomId?.toString();
if (!roomId) {
  router.back();
}

MeetGateway.getByHash(roomId).then((meet) => {
  if (!meet) {
    router.back();
  }
});

const videoChat = computed(() => useInitVideoChat(roomId, actions, store));

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

const messageModel = ref("");
const handleSendMessage = () => {
  videoChat.value.chat.value.push({
    user:
      store.state.auth.user.firstName + " " + store.state.auth.user.lastName,
    type: "text",
    content: messageModel.value,
    time: moment().format("H:mm"),
    mine: true,
  });
  videoChat.value.socket.emit("sendMessage", {
    user:
      store.state.auth.user.firstName + " " + store.state.auth.user.lastName,
    type: "text",
    content: messageModel.value,
    time: moment().format("H:mm"),
  });

  messageModel.value = "";
};

const videoGridEl = ref(null);
const sideBlockMaxHeight = ref(0);
const resizeObserver = ref(null);
onMounted(() => {
  resizeObserver.value = new ResizeObserver(
    (entries: ResizeObserverEntry[]) => {
      window.requestAnimationFrame((): void | undefined => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        sideBlockMaxHeight.value = videoGridEl.value.clientHeight + "px";
      });
    }
  );
  resizeObserver.value?.observe(videoGridEl.value);
});
onBeforeUnmount(() => resizeObserver.value?.unobserve(videoGridEl.value));

const fileInput = ref(null);
const handleFileSend = async () => {
  fileInput.value.$el.nextSibling.click();

  fileInput.value.$el.nextSibling.onchange = async (e) => {
    const file = e.target.files[0];

    if (file.size >= 3145728) {
      await store.dispatch("toast/new", {
        message: "Вес файла не должен превышать 3 Mb",
        type: ToastsTypes.ERROR,
      });

      return;
    }

    const content = await convertFileToBase64(file);

    videoChat.value.chat.value.push({
      user:
        store.state.auth.user.firstName + " " + store.state.auth.user.lastName,
      type: "file",
      content: {
        name: file.name,
        content: content,
      },
      time: moment().format("H:mm"),
      mine: true,
    });

    videoChat.value.socket.emit("sendMessage", {
      user:
        store.state.auth.user.firstName + " " + store.state.auth.user.lastName,
      type: "file",
      content: {
        name: file.name,
        content: content,
      },
      time: moment().format("H:mm"),
    });
  };
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
        ref="videoGridEl"
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
      <div v-if="actions.showUsers || actions.showChat" class="sideBlock">
        <div
          class="chat-container sideBlockContainer p-4 d-flex flex-column justify-content-between"
          v-if="actions.showChat"
        >
          <TypographyText class="mb-3" :element="TypographyElements.H4"
            >Чат</TypographyText
          >
          <div class="overflow-auto h-100">
            <div
              class="messages pb-3 d-flex flex-column gap-2 justify-content-end"
            >
              <div
                class="message p-2"
                :class="{ 'ms-auto': message.mine }"
                v-for="message in videoChat.chat.value"
                :key="message"
              >
                <div class="d-flex justify-content-between messageHeader gap-4">
                  <TypographyText :element="TypographyElements.P">{{
                    message.user
                  }}</TypographyText>
                  <TypographyText :element="TypographyElements.P">{{
                    message.time
                  }}</TypographyText>
                </div>
                <TypographyText
                  class="messageContent"
                  v-if="message.type !== 'file'"
                  color="#000000"
                  :element="TypographyElements.P"
                  >{{ message.content }}</TypographyText
                >
                <a
                  v-else
                  :download="message.content.name"
                  :href="message.content.content"
                >
                  {{ message.content.name }}
                </a>
              </div>
            </div>
          </div>
          <form
            @submit.prevent="handleSendMessage"
            class="form-floating d-flex"
          >
            <InputField
              id="messageInput"
              className="form-control"
              label="Сообщение"
              placeholder="Сообщение"
              style="padding-right: 32px"
              v-model="messageModel"
            />
            <button class="sendFileBtn" type="button" @click="handleFileSend">
              <i class="bi bi-paperclip" />
              <InputField
                ref="fileInput"
                id="fileInput"
                type="file"
                className="visually-hidden"
              />
            </button>
            <button
              type="submit"
              class="btn btn-outline-secondary"
              style="width: 30%"
            >
              Отправить
            </button>
          </form>
        </div>
        <div
          class="users-container sideBlockContainer p-4"
          v-if="actions.showUsers"
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
  max-height: v-bind(sideBlockMaxHeight);
}

.sideBlock .sideBlockContainer {
  height: 100%;
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

.overflow-auto {
  max-height: 100%;
}

.message {
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  background-color: #f8f8f8;
  width: fit-content;
}

.messageHeader {
  font-size: 0.7rem !important;
}

.messageContent {
  font-size: 0.8rem !important;
}

.sendFileBtn {
  border: none;
  background: none;
  cursor: pointer;
  position: absolute;
  right: 30%;
  height: 100%;
}

.sendFileBtn i {
  font-size: 1.5rem;
}
</style>
