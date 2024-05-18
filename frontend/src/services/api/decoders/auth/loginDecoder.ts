import { field, number, string, succeed } from "jsonous";
import { ExtractDecoderType } from "@/services/api/decoders/types";
import LoginResult from "@/entities/auth/loginResult";
import { orNull } from "@/services/api/decoders/commonDecoders";
import { toObject } from "@/services/api/decoders";

export const loginDecoder = succeed({})
  .assign("token", orNull(field("token", string)))
  .assign("userId", orNull(field("userId", number)))
  .andThen(toObject(LoginResult));

export type LoginResultInterface = ExtractDecoderType<typeof loginDecoder.decodeAny>;