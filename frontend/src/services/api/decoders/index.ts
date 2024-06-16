import Decoder, { succeed } from "jsonous";

export interface ApiResponse<T> {
  success: boolean;
  errorMessage: string | null;
  payload: T | null;
}

export function toObject<T>(name: { new (): T }): (obj: any) => Decoder<T> {
  return (obj) => succeed(Object.assign(new name(), obj));
}
