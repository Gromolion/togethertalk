import { field, number, string, succeed } from "jsonous";
import { ExtractDecoderType } from "@/services/api/decoders/types";
import LoginResult from "@/entities/auth/loginResult";
import { orNull } from "@/services/api/decoders/commonDecoders";
import { toObject } from "@/services/api/decoders";
import { userDecoder } from "@/services/api/decoders/user/userDecoder";

export const loginDecoder = succeed({})
  .assign("token", orNull(field("token", string)))
  .assign("user", orNull(field("user", userDecoder)))
  .assign("expiresIn", orNull(field("user", number)))
  .andThen(toObject(LoginResult));

export type LoginResultInterface = ExtractDecoderType<
  typeof loginDecoder.decodeAny
>;
