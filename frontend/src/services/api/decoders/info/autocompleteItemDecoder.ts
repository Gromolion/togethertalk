import { field, number, string, succeed } from "jsonous";
import { ExtractDecoderType } from "@/services/api/decoders/types";

export const autocompleteItemDecoder = succeed({})
  .assign("id", field("id", number))
  .assign("value", field("value", string));

export type AutocompleteItemInterface = ExtractDecoderType<
  typeof autocompleteItemDecoder.decodeAny
>;
