export type AppErrorValue = string;

export class AppError<ERROR_TYPE extends string = AppErrorValue> {
  static isAppError(value: any): value is AppError {
    return value instanceof AppError;
  }

  message = "";

  errors: Record<string, ERROR_TYPE> = {};

  clearErrors() {
    this.message = "";
    this.errors = {};
  }

  clearError(name: string) {
    this.errors[name] = "" as ERROR_TYPE;
  }

  setError(name: string, error: ERROR_TYPE) {
    this.errors[name] = error;
    this.runErrorsObserver();
  }

  setErrors(errors: Record<string, ERROR_TYPE>) {
    this.errors = errors;
    this.runErrorsObserver();
  }

  hasError(name: string) {
    return !!this.errors[name];
  }

  hasErrors() {
    return Object.keys(this.errors).length !== 0;
  }

  hasAnyError() {
    return this.hasErrors() || this.message !== "";
  }

  getError(errorName: string) {
    return this.errors[errorName];
  }

  setMessage(message: string) {
    this.message = message;
  }

  private errorsObservers = new Set<Function>();

  private runErrorsObserver() {
    this.errorsObservers.forEach((func) => func());
  }

  observeErrors = (callback: Function) => {
    this.errorsObservers.add(callback);
    return () => {
      this.errorsObservers.delete(callback);
    };
  };
}