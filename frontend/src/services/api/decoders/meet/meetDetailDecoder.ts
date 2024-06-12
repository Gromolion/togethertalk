import { array, field, number, string, succeed } from "jsonous";
import { userDecoder } from "@/services/api/decoders/user/userDecoder";
import { ExtractDecoderType } from "@/services/api/decoders/types";
import { participantDecoder } from "@/services/api/decoders/meet/participantDecoder";

export const meetDetailDecoder = succeed({})
  .assign("id", field("id", number))
  .assign("theme", field("theme", string))
  .assign("description", field("description", string))
  .assign("initiator", field("initiator", userDecoder))
  .assign("participants", field("participants", array(participantDecoder)))
  .assign("hash", field("hash", string))
  .assign("meetAt", field("meetAt", string));

export type MeetDetailInterface = ExtractDecoderType<
  typeof meetDetailDecoder.decodeAny
>;
