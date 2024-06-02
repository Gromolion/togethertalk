import { LoginResultInterface } from "@/services/api/decoders/auth/loginDecoder";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";

export default class LoginResult implements LoginResultInterface {
  token: string;
  user: UserInterface;
  expiresIn: number;
}
