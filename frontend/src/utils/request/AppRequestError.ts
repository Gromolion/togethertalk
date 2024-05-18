import { AppRequestErrors } from "@/enums/errors";
import { AppError, AppErrorValue } from "@/utils/request/AppError";
import axios, { AxiosError } from "axios";
import { isObject } from "class-validator";

export class AppRequestError extends AppError {
  public readonly type: AppRequestErrors = AppRequestErrors.REQUEST_ERROR;

  static isRequestError(data: any): data is AppRequestError {
    return data instanceof AppRequestError;
  }

  static isCancelError(data: any) {
    return AppRequestError.isRequestError(data) && axios.isCancel(data.axiosError);
  }

  static unwrap(error: AppRequestError) {
    return error.axiosError?.response?.data as ApiResponse<any>;
  }

  static buildFromAxiosError(error: AxiosError) {
    return new AppRequestError(
      { message: error.message, errors: {} },
      error.response?.status || -1,
      error,
    );
  }

  constructor(
    private _error: { message: string; errors: Record<string, AppErrorValue> },
    public statusCode: number,
    public axiosError?: AxiosError,
  ) {
    super();
    this.setMessage(_error.message);
    this.setErrors(_error.errors);
  }

  get responseErrorMessage() {
    const error = this.axiosError?.response?.data?.errorMessage;
    return isObject(error) ? Object.values(error).join("\n") : error || "";
  }
}