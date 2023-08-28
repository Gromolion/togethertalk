import useSocket from "@/hooks/useSocket";
import usePeer from "@/hooks/usePeer";
import { Ref, ref } from "vue";
import { Video } from "@/components/ChatRoom/types";
import { MediaConnection } from "peerjs";

export function useInitVideoChat() {
  const videos: Ref<Video[]> = ref([]);
  const socket = useSocket("chat-room", {
    extraHeaders: {
      "Chat-Room-UUID": "d97a22df-dd04-40b0-8611-232a3493ef79",
    },
  });
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      videos.value.push({
        socketId: socket.id,
        stream: stream,
      });

      const peer = usePeer(socket.id, "/peerjs");

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
    });

  return videos;
}
