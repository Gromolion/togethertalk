import MeetModel from "@/storage/modules/meet/MeetModel";
import { METHODS, RequestManager } from "@/utils/request";
import {
  meetShortDecoder,
  MeetShortInterface,
} from "@/services/api/decoders/meet/meetShortDecoder";
import { array } from "jsonous";
import { orNull } from "@/services/api/decoders/commonDecoders";

export class MeetGateway {
  public static create(meetModel: MeetModel): Promise<MeetShortInterface> {
    return RequestManager.createRequest({
      url: "/meet",
      method: METHODS.POST,
      serverDataDecoder: meetShortDecoder,
    })({ body: meetModel });
  }

  public static listForDate(
    date: string,
    page: number,
    perPage: number
  ): Promise<MeetShortInterface[]> {
    return RequestManager.createRequest({
      url: "/meet/list",
      method: METHODS.GET,
      serverDataDecoder: array(meetShortDecoder),
    })({
      body: {
        listAt: date,
        page: page,
        perPage: perPage,
      },
    });
  }

  public static cancel(id: number) {
    return RequestManager.createRequest({
      url: "/meet",
      method: METHODS.DELETE,
    })({
      body: {
        id: id,
      },
    });
  }

  public static getByHash(hash: string) {
    return RequestManager.createRequest({
      url: "/meet/by-hash",
      method: METHODS.GET,
      serverDataDecoder: orNull(meetShortDecoder),
    })({
      body: {
        hash: hash,
      },
    });
  }
}
