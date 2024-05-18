import { LoginResultInterface } from "@/services/api/decoders/auth/loginDecoder";

export default class LoginResult implements LoginResultInterface {
  token?: string;
  userId?: number;
}