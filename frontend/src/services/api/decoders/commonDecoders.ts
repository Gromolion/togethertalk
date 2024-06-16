import Decoder, { succeed } from "jsonous";
import { err, ok } from "resulty";
import { isNil } from "ramda";

export function orNull<T>(decoder: Decoder<T>, defaultValue: T | null = null) {
  return new Decoder<T | null>((value) => {
    return decoder.decodeAny(value).cata({
      Ok: (value) => ok<string, T>(value),
      Err: () => ok<string, T | null>(defaultValue),
    });
  });
}
