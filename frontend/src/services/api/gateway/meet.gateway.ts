import MeetModel from "@/storage/modules/meet/MeetModel";
import { METHODS, RequestManager } from "@/utils/request";
import { array, string } from "jsonous";
import {
  meetDetailDecoder,
  MeetDetailInterface,
} from "@/services/api/decoders/meet/meetDetailDecoder";
import { orNull } from "@/services/api/decoders/commonDecoders";
import { participantDecoder } from "@/services/api/decoders/meet/participantDecoder";
import FilterModel from "@/storage/modules/report/FilterModel";
import {
  meetListDecoder,
  MeetListInterface,
} from "@/services/api/decoders/meet/meetListDecoder";

export class MeetGateway {
  public static create(meetModel: MeetModel): Promise<MeetDetailInterface> {
    return RequestManager.createRequest({
      url: "/meet",
      method: METHODS.POST,
      serverDataDecoder: meetDetailDecoder,
    })({ body: meetModel });
  }

  public static update(meetModel: MeetModel): Promise<MeetDetailInterface> {
    return RequestManager.createRequest({
      url: "/meet",
      method: METHODS.PUT,
      serverDataDecoder: meetDetailDecoder,
    })({ body: meetModel });
  }

  public static listForDate(
    date: string,
    page: number,
    perPage: number
  ): Promise<MeetListInterface> {
    return RequestManager.createRequest({
      url: "/meet/list",
      method: METHODS.GET,
      serverDataDecoder: meetListDecoder,
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
      serverDataDecoder: orNull(meetDetailDecoder),
    })({
      body: {
        hash: hash,
      },
    });
  }

  public static addParticipant(meetId: number, userId: number) {
    return RequestManager.createRequest({
      url: "/meet/add-participant",
      method: METHODS.POST,
      serverDataDecoder: participantDecoder,
    })({
      body: {
        meetId: meetId,
        userId: userId,
      },
    });
  }

  public static removeParticipant(meetId: number, userId: number) {
    return RequestManager.createRequest({
      url: "/meet/delete-participant",
      method: METHODS.DELETE,
    })({
      body: {
        meetId: meetId,
        userId: userId,
      },
    });
  }

  public static report(filter: FilterModel) {
    return RequestManager.createRequest({
      url: "/meet/report",
      method: METHODS.GET,
      serverDataDecoder: array(meetDetailDecoder),
    })({
      body: filter,
    });
  }

  public static reportDownload(filter: FilterModel) {
    return RequestManager.createRequest({
      url: "/meet/report-download",
      method: METHODS.GET,
      serverDataDecoder: string,
    })({
      body: filter,
    });
  }
}
