import axios, { AxiosError, AxiosRequestConfig, CancelToken } from "axios";
import { AppRequestError } from "@/utils/request/AppRequestError";
import Decoder from "jsonous";
import { ID } from "@/services/api/types";

export type CreateRequest<DecoderGenericType> = {
  url: string;
  method?: METHODS;
  serverDataDecoder?: Decoder<DecoderGenericType>;
  requestConfig?: {
    contentType?: string;
    responseType?: AxiosRequestConfig["responseType"];
    token?: string;
  };
};

export interface RequestOptions {
  disableBeforeErrorMiddlewares?: boolean;
  progressReceiver?: (progress: number) => void;
  cancelToken?: CancelToken;
}

export interface RequestData {
  body?: any;
  additionalQueryParams?: Record<string, string | number | ID[]>;
  options?: RequestOptions;
  urlParams?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export type onUploadProgressCallback = (progress: number) => void;

export interface TrackRequestInterface<Data> {
  send(requestData: RequestData): Promise<Data>;
  onUploadProgress: (callback: onUploadProgressCallback) => void;
  abort(message?: string): void;
}

export enum METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  DELETE = "delete",
}

function template(text: string, keyMap: Record<string, string | number>) {
  return Object.keys(keyMap).reduce(
    (prev, mapKey) => prev.replace(`{${mapKey}}`, keyMap[mapKey].toString()),
    text
  );
}

export class RequestManager {
  public static baseUrl: string;

  static beforeRequestMiddleware: ((data: {
    config: AxiosRequestConfig;
  }) => void | Promise<void>)[] = [];

  static beforeErrorMiddleware: ((data: {
    error: AppRequestError;
    config: AxiosRequestConfig;
    shareData: Record<string, any>;
  }) => AppRequestError | Promise<AppRequestError | null> | null)[] = [];

  static createTrackedRequest<DecoderValue>(
    params: CreateRequest<DecoderValue>
  ) {
    const cancelToken = axios.CancelToken.source();
    const requestInstance = this.createRequest(params);
    let onProgress = (() => {}) as any;

    return {
      async send(requestData: RequestData = {}) {
        return requestInstance({
          ...requestData,
          options: {
            ...requestData.options,
            cancelToken: cancelToken.token,
            progressReceiver: onProgress,
          },
        });
      },

      onUploadProgress: (callback: onUploadProgressCallback) => {
        onProgress = callback;
      },

      abort(message?: string) {
        cancelToken.cancel(message);
      },
    };
  }

  static createRequest<DecoderValue>({
    url,
    method = METHODS.GET,
    requestConfig = {},
    serverDataDecoder,
  }: CreateRequest<DecoderValue>) {
    return async function (
      requestData: RequestData = {}
    ): Promise<DecoderValue> {
      const [requestResult, requestError] = await RequestManager.makeRequest({
        url,
        method,
        requestConfig,
        requestData,
      });

      if (requestError)
        throw await RequestManager.applyError(
          AppRequestError.buildFromAxiosError(requestError.axiosError),
          requestError.requestData,
          requestData
        );

      if (!requestResult || !serverDataDecoder) return null!;

      const [data, decoderError] = serverDataDecoder
        .decodeAny(requestResult.response)
        .cata<[DecoderValue, string | null]>({
          Ok: (val) => [val, null],
          Err: (err) => [null!, err],
        });

      if (!decoderError) return data;
      throw await RequestManager.applyError(
        new AppRequestError(
          { message: `Response parsing error: ${decoderError}`, errors: {} },
          -1
        ),
        requestResult.requestData,
        requestData
      );
    };
  }

  private static async makeRequest({
    url,
    method,
    requestConfig,
    requestData: {
      options = {},
      urlParams,
      additionalQueryParams,
      body,
      headers,
    },
  }: Required<Pick<CreateRequest<any>, "url" | "method" | "requestConfig">> & {
    requestData: RequestData;
  }) {
    const requestData: AxiosRequestConfig = {
      url,
      method,
      baseURL: RequestManager.baseUrl,
      headers: { accept: "application/json", ...headers },
      withCredentials: true,
    };

    if (requestConfig.contentType) {
      requestData.headers!["content-type"] = requestConfig.contentType;
    }
    if (requestConfig.responseType) {
      requestData.responseType = requestConfig.responseType;
    }

    requestData[method === METHODS.GET ? "params" : "data"] = body;

    if (urlParams) {
      requestData.url = template(requestData.url!, urlParams);
    }

    if (additionalQueryParams) {
      requestData.params = additionalQueryParams;
    }

    if (options.progressReceiver) {
      requestData.onUploadProgress = function ({ loaded, total }) {
        options.progressReceiver!((loaded / total!) * 100);
      };
    }

    if (options.cancelToken) {
      requestData.cancelToken = options.cancelToken;
    }

    try {
      await RequestManager.applyAllBeforeRequestMiddleware(requestData);
      const { data } = await axios(requestData);
      return [{ requestData, response: data }, null] as const;
    } catch (axiosError) {
      return [
        null,
        { requestData, axiosError } as {
          requestData: AxiosRequestConfig;
          axiosError: AxiosError;
        },
      ] as const;
    }
  }

  private static async applyError(
    error: AppRequestError,
    axiosRequestConfig: AxiosRequestConfig,
    requestData: RequestData = {}
  ) {
    if (requestData.options?.disableBeforeErrorMiddlewares) return error;
    return await RequestManager.applyAllBeforeErrorMiddleware(
      error,
      axiosRequestConfig
    );
  }

  private static async applyAllBeforeRequestMiddleware(
    config: AxiosRequestConfig
  ) {
    for (let i = 0; i < RequestManager.beforeRequestMiddleware.length; i++) {
      const middleware = RequestManager.beforeRequestMiddleware[i];
      await middleware({ config });
    }
  }

  private static async applyAllBeforeErrorMiddleware(
    error: AppRequestError,
    config: AxiosRequestConfig
  ) {
    const shareData: Record<string, any> = {};
    for (let i = 0; i < RequestManager.beforeErrorMiddleware.length; i++) {
      const middleware = RequestManager.beforeErrorMiddleware[i];
      const middlewareResult = await middleware({ error, config, shareData });
      if (!middlewareResult) break;

      error = middlewareResult;
    }

    return error;
  }
}
