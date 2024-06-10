import { field, number, string, succeed } from "jsonous";
import { userDecoder } from "@/services/api/decoders/user/userDecoder";
import { ExtractDecoderType } from "@/services/api/decoders/types";

export const meetShortDecoder = succeed({})
  .assign("id", field("id", number))
  .assign("theme", field("theme", string))
  .assign("initiator", field("initiator", userDecoder))
  .assign("participantsCount", field("participantsCount", number))
  .assign("hash", field("hash", string))
  .assign("meetAt", field("meetAt", string));

export type MeetShortInterface = ExtractDecoderType<
  typeof meetShortDecoder.decodeAny
>;
