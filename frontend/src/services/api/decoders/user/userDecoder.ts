import { array, field, number, string, succeed } from "jsonous";
import { ExtractDecoderType } from "@/services/api/decoders/types";

export const userDecoder = succeed({})
  .assign("id", field("id", number))
  .assign("login", field("login", string))
  .assign("email", field("email", string))
  .assign("firstName", field("firstName", string))
  .assign("lastName", field("lastName", string))
  .assign("position", field("position", string))
  .assign("roles", field("roles", array(string)));

export type UserInterface = ExtractDecoderType<typeof userDecoder.decodeAny>;
