import { field, number, string, succeed } from "jsonous";
import { ExtractDecoderType } from "@/services/api/decoders/types";

export const participantDecoder = succeed({})
  .assign("id", field("id", number))
  .assign("firstName", field("firstName", string))
  .assign("lastName", field("lastName", string));

export type ParticipantInterface = ExtractDecoderType<
  typeof participantDecoder.decodeAny
>;
