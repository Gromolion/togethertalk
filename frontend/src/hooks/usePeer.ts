import Peer from "peerjs";

export default function (id: string, path?: string) {
  return new Peer(id, {
    path: path,
    host: "192.168.1.66",
    port: 3000,
    config: {
      iceServers: [
        { url: "stun:stun.l.google.com:19302" },
        { url: "stun:stun1.l.google.com:19302" },
        { url: "stun:stun2.l.google.com:19302" },
        { url: "stun:stun3.l.google.com:19302" },
        { url: "stun:stun4.l.google.com:19302" },
        {
          url: "turn:0.peerjs.com:3478",
          username: "peerjs",
          credential: "peerjsp",
        },
      ],
      sdpSemantics: "unified-plan",
    },
  });
}
