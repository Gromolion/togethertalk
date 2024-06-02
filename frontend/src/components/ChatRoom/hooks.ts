import useSocket from "@/hooks/useSocket";
import usePeer from "@/hooks/usePeer";
import { computed, reactive, Ref, ref, UnwrapNestedRefs, watch } from "vue";
import { Video } from "@/components/ChatRoom/types";
import Peer, { MediaConnection } from "peerjs";
// noinspection ES6UnusedImports
import adapter from "webrtc-adapter";
import { Store } from "vuex";
import ChatActions from "@/entities/chat/chatActions";
import { Socket } from "socket.io-client";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";

export function useInitVideoChat(
  roomId: string,
  actions: ChatActions,
  store: Store
) {
  const videos: Ref<Video[]> = ref([]);

  const socket = useSocket("chat-room", {
    extraHeaders: {
      "Chat-Room-UUID": roomId,
      authorization: `Bearer ${store.getters["auth/auth"].token}`,
    },
  });

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then(onFulfilled(videos, socket, actions, store), onRejected());

  return {
    socket: socket,
    videos: videos,
  };
}

function onFulfilled(
  videos: Ref<Video[]>,
  socket: Socket,
  actions: ChatActions,
  store: Store
) {
  return (stream) => {
    const myStream = stream.clone();

    myStream.getAudioTracks().forEach((track) => (track.enabled = false));

    const enableVideo = computed(() => actions.enableVideo);
    const enableAudio = computed(() => actions.enableAudio);

    const videoTrack = stream.getVideoTracks()[0];

    const selfVideo = reactive({
      socketId: socket.id,
      stream: myStream,
      user: store.state.auth.user,
      enableVideo: false,
      enableAudio: false,
    });

    videos.value.push(selfVideo);

    watch(
      enableVideo,
      watchVideoCallback(myStream, stream, selfVideo, socket),
      { immediate: true }
    );

    const demonstrationTrack = ref(null);
    watch(
      () => actions.enableDemonstration,
      async (enableDemonstration) => {
        if (!enableDemonstration) {
          demonstrationTrack.value &&
            stream.removeTrack(demonstrationTrack.value);

          stream.addTrack(videoTrack);

          return;
        }

        try {
          actions.enableVideo = false;

          demonstrationTrack.value = (
            await navigator.mediaDevices.getDisplayMedia({
              video: { cursor: "always" },
              audio: false,
            })
          ).getVideoTracks()[0];
        } catch (error) {
          actions.toggleDemonstration();
          stream.addTrack(videoTrack);

          return;
        }

        stream.removeTrack(videoTrack);
        stream.addTrack(demonstrationTrack.value);

        console.log(stream.getTracks());

        socket.emit("videoTrackChange");
      }
    );
    watch(enableAudio, watchAudioCallback(stream, selfVideo, socket), {
      immediate: true,
    });

    const peer = usePeer(
      socket.id,
      store.getters["auth/auth"].token,
      "/peerjs"
    );

    peer.on(`open`, (id: string) => {
      socket.emit(`join-room`, id);
    });

    peer.on(
      `call`,
      peerOnCall(
        actions.enableDemonstration ? demonstrationStream : stream,
        videos
      )
    );

    socket.on(
      `user-connected`,
      socketOnUserConnected(peer, stream, socket, videos)
    );

    socket.on("user-disconnected", (socketId: string) => {
      console.log("user disconnected  " + socketId);
      videos.value = videos.value.filter((video) => {
        return video.socketId !== socketId;
      });
    });

    socket.on("videoTrackChanged", (body) => {
      videos.value.forEach((video) => {
        if (video.socketId === body.socketId) {
          video.enableVideo = body.enable;
        }
      });
    });

    socket.on("audioTrackChanged", (body) => {
      videos.value.forEach((video) => {
        if (video.socketId === body.socketId) {
          video.enableAudio = body.enable;
        }
      });
    });
  };
}

function watchVideoCallback(
  myStream,
  stream,
  selfVideo: UnwrapNestedRefs<{
    socketId: string;
    stream: MediaStream;
    enableVideo: boolean;
    enableAudio: boolean;
    user: UserInterface;
  }>,
  socket: Socket
) {
  return (enableVideo) => {
    myStream.getVideoTracks().forEach((track) => (track.enabled = enableVideo));
    stream.getVideoTracks().forEach((track) => (track.enabled = enableVideo));

    selfVideo.enableVideo = enableVideo;

    socket.emit("videoTrackChange", {
      socketId: socket.id,
      enable: enableVideo,
    });
  };
}

function watchAudioCallback(
  stream,
  selfVideo: UnwrapNestedRefs<{
    socketId: string;
    stream: MediaStream;
    enableVideo: boolean;
    enableAudio: boolean;
    user: UserInterface;
  }>,
  socket: Socket
) {
  return (enableAudio) => {
    stream.getAudioTracks().forEach((track) => (track.enabled = enableAudio));

    selfVideo.enableAudio = enableAudio;

    socket.emit("audioTrackChange", {
      socketId: socket.id,
      enable: enableAudio,
    });
  };
}

function peerOnCall(stream, videos: Ref<Video[]>) {
  return (call: MediaConnection) => {
    call.answer(stream);
    call.once(`stream`, (userVideoStream: MediaStream) => {
      videos.value.push({
        socketId: call.metadata.webSocketId,
        stream: userVideoStream,
        user: call.metadata.user,
        enableVideo: false,
        enableAudio: false,
      });
    });
  };
}

function socketOnUserConnected(
  peer: Peer,
  stream,
  socket: Socket,
  videos: Ref<Video[]>
) {
  return (user: User, socketId: string) => {
    if (!user) return;

    const call = peer.call(socketId, stream, {
      metadata: {
        webSocketId: socket.id,
        user: user,
      },
    });
    call?.once(`stream`, (userVideoStream: MediaStream) => {
      videos.value.push({
        socketId: socketId,
        stream: userVideoStream,
        user: user,
        enableVideo: false,
        enableAudio: false,
      });
    });
  };
}

function onRejected() {
  return (error) => {
    console.log(error);
  };
}
