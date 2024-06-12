import { METHODS, RequestManager } from "@/utils/request";
import { array } from "jsonous";
import {
  autocompleteItemDecoder,
  AutocompleteItemInterface,
} from "@/services/api/decoders/info/autocompleteItemDecoder";

export class InfoGateway {
  public static autocomplete(
    query: string,
    type: string
  ): Promise<AutocompleteItemInterface[]> {
    return RequestManager.createRequest({
      url: "/info/autocomplete",
      method: METHODS.GET,
      serverDataDecoder: array(autocompleteItemDecoder),
    })({
      body: {
        query: query,
        type: type,
      },
    });
  }
}
