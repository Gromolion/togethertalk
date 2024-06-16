import { array, field, number, succeed } from "jsonous";
import { meetDetailDecoder } from "@/services/api/decoders/meet/meetDetailDecoder";
import { ExtractDecoderType } from "@/services/api/decoders/types";

export const meetListDecoder = succeed({})
  .assign("list", field("list", array(meetDetailDecoder)))
  .assign("totalCount", field("totalCount", number));

export type MeetListInterface = ExtractDecoderType<
  typeof meetListDecoder.decodeAny
>;
