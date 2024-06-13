import { METHODS, RequestManager } from "@/utils/request";
import {
  userListDecoder,
  UserListInterface,
} from "@/services/api/decoders/user/userListDecoder";
import UserModel from "@/storage/modules/user/UserModel";

export default class UserGateway {
  public static create(user: UserModel) {
    return RequestManager.createRequest({
      url: "/user",
      method: METHODS.POST,
    })({
      body: user,
    });
  }

  public static list(
    page: number,
    perPage: number
  ): Promise<UserListInterface> {
    return RequestManager.createRequest({
      url: "/user/list",
      method: METHODS.GET,
      serverDataDecoder: userListDecoder,
    })({
      body: {
        page: page,
        perPage: perPage,
      },
    });
  }
}
