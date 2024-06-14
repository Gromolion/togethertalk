import { METHODS, RequestManager } from "@/utils/request";
import {
  userListDecoder,
  UserListInterface,
} from "@/services/api/decoders/user/userListDecoder";
import UserModel from "@/storage/modules/user/UserModel";
import { string } from "jsonous";

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

  public static remove(id: number) {
    return RequestManager.createRequest({
      url: "user",
      method: METHODS.DELETE,
    })({
      body: {
        id: id,
      },
    });
  }

  public static setAvatar(id: number) {
    return RequestManager.createTrackedRequest({
      url: `user/${id}/avatar`,
      method: METHODS.POST,
      serverDataDecoder: string,
    });
  }

  public static removeAvatar(id: number) {
    return RequestManager.createRequest({
      url: `user/${id}/avatar`,
      method: METHODS.DELETE,
    })();
  }
}
