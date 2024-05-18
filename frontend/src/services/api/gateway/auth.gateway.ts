import { METHODS, RequestManager } from "@/utils/request";
import AuthModel from "@/storage/modules/auth/AuthModel";
import { loginDecoder, LoginResultInterface } from "@/services/api/decoders/auth/loginDecoder";
import { extendBaseDecoder } from "@/services/api/decoders";

export class AuthGateway {
  public static login(authModel: AuthModel): Promise<LoginResultInterface> {
    return RequestManager.createRequest({
      url: "/auth/login",
      method: METHODS.POST,
      serverDataDecoder: extendBaseDecoder(loginDecoder),
    })({ body: { ...authModel.plainObject } });
  }
}