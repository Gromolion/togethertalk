import { METHODS, RequestManager } from "@/utils/request";
import AuthModel from "@/storage/modules/auth/AuthModel";
import {
  loginDecoder,
  LoginResultInterface,
} from "@/services/api/decoders/auth/loginDecoder";
import {
  resetPasswordDecoder,
  ResetPasswordResultInterface,
} from "@/services/api/decoders/auth/resetPasswordDecoder";

export class AuthGateway {
  public static login(authModel: AuthModel): Promise<LoginResultInterface> {
    return RequestManager.createRequest({
      url: "/auth/login",
      method: METHODS.POST,
      serverDataDecoder: loginDecoder,
    })({ body: authModel });
  }

  public static resetPassword(
    login: string
  ): Promise<ResetPasswordResultInterface> {
    return RequestManager.createRequest({
      url: "/auth/reset-password",
      method: METHODS.POST,
      serverDataDecoder: resetPasswordDecoder,
    })({ body: { login } });
  }

  public static resetPasswordByHash(hash: string, password: string) {
    return RequestManager.createRequest({
      url: "/auth/reset-password-by-hash",
      method: METHODS.POST,
      serverDataDecoder: null,
    })({ body: { hash: hash, password: password } });
  }
}
