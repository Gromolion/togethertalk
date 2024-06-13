import { array, field, number, succeed } from "jsonous";
import { userDecoder } from "@/services/api/decoders/user/userDecoder";
import { ExtractDecoderType } from "@/services/api/decoders/types";

export const userListDecoder = succeed({})
  .assign("users", field("list", array(userDecoder)))
  .assign("totalCount", field("totalCount", number));

export type UserListInterface = ExtractDecoderType<
  typeof userListDecoder.decodeAny
>;
