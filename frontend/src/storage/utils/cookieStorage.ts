import Cookies, { CookieAttributes } from "js-cookie";

export class CookieStorage {
  static set(key: string, value: string, options?: CookieAttributes) {
    Cookies.set(key, value, options);
  }

  static get(key: string) {
    return Cookies.get(key);
  }

  static remove(key: string) {
    Cookies.remove(key);
  }
}
