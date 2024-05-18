import Decoder from "jsonous";

export function orNull<T>(decoder: Decoder<T>, defaultValue: T | null = null) {
  return new Decoder<T | null>((value) => {
    return decoder.decodeAny(value).cata({
      Ok: (value) => ok<string, T>(value),
      Err: () => ok<string, T | null>(defaultValue),
    });
  });
}

export const fieldWithDefaultDecoder = <A>(
  key: string,
  decoder: Decoder<A>,
  defaultValue: A | null = null,
) =>
  new Decoder<A | null>((value: Record<string, any>) => {
    if (isNil(value) || isNil(value[key])) {
      return ok(defaultValue);
    }
    return decoder.decodeAny(value[key]).cata({
      Ok: (value) => ok<string, A>(value),
      Err: (error) => err<string, A>(error),
    });
  });