import { UserInterface } from "@/services/api/decoders/user/userDecoder";

export type Video = {
  socketId: String;
  stream: MediaStream;
  user: UserInterface;
  enableVideo: boolean;
  enableAudio: boolean;
};

export type Message = {
  user: string;
  type: "text" | "file";
  content: string | { name: string; content: string };
  time: string;
  mine: boolean;
};
