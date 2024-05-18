import useSocket from "@/hooks/useSocket";
import usePeer from "@/hooks/usePeer";
import { Ref, ref } from "vue";
import { Video } from "@/components/ChatRoom/types";
import { MediaConnection } from "peerjs";
// noinspection ES6UnusedImports
import adapter from "webrtc-adapter";
import { useStore } from "vuex";

export function useInitVideoChat(roomId: string) {
  const videos: Ref<Video[]> = ref([]);

  const store = useStore();

  const socket = useSocket("chat-room", {
    extraHeaders: {
      "Chat-Room-UUID": roomId,
      authorization: `Bearer ${store.state.auth.token}`,
    },
  });
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then(
      (stream) => {
        videos.value.push({
          socketId: socket.id,
          stream: stream,
        });

        const peer = usePeer(socket.id, store.state.auth.token, "/peerjs");

        peer.on(`open`, (id: string) => {
          socket.emit(`join-room`, id);
        });

        peer.on(`call`, (call: MediaConnection) => {
          call.answer(stream);
          call.on(`stream`, (userVideoStream: MediaStream) => {
            videos.value.push({
              socketId: call.metadata.socketId,
              stream: userVideoStream,
            });
          });
        });

        socket.on(`user-connected`, (userId: string, socketId: string) => {
          console.log(`user-connected ${userId} - ${socketId}`);
          const call = peer.call(userId, stream, {
            metadata: {
              socketId: socket.id,
            },
          });
          call.on(`stream`, (userVideoStream: MediaStream) => {
            videos.value.push({
              socketId: socketId,
              stream: userVideoStream,
            });
          });
        });

        socket.on("user-disconnected", (socketId: string) => {
          videos.value = videos.value.filter((video) => {
            return video.socketId !== socketId;
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );

  return videos;
}
