import { UserInterface } from "@/services/api/decoders/user/userDecoder";

export type Video = {
  socketId: String;
  stream: MediaStream;
  user: UserInterface;
  enableVideo: boolean;
  enableAudio: boolean;
};
