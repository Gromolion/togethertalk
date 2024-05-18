import Decoder, { boolean, field, string, succeed } from "jsonous";
import { fieldWithDefaultDecoder } from "@/services/api/decoders/commonDecoders";

export const extendBaseDecoder = <T>(decoder: Decoder<T> = identityValueDecoder) =>
  succeed({})
    .assign("success", field("success", boolean))
    .assign("errorMessage", fieldWithDefaultDecoder("errorMessage", string, null))
    .assign("payload", fieldWithDefaultDecoder("payload", decoder, null));

export function toObject<T>(name: { new (): T }): (obj: any) => Decoder<T> {
  return (obj) => succeed(Object.assign(new name(), obj));
}