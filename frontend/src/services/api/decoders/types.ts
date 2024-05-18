export type ExtractDecoderType<A extends (v: any) => { getOrElseValue: any }> = ReturnType<
  ReturnType<A>["getOrElseValue"]
>;
