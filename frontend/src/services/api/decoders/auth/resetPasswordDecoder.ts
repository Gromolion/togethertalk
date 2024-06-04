import { field, string, succeed } from "jsonous";
import { orNull } from "@/services/api/decoders/commonDecoders";
import { ExtractDecoderType } from "@/services/api/decoders/types";

export const resetPasswordDecoder = succeed({}).assign(
  "hash",
  orNull(field("hash", string))
);

export type ResetPasswordResultInterface = ExtractDecoderType<
  typeof resetPasswordDecoder.decodeAny
>;
