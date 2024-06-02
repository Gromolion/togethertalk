import { CookieAttributes } from "js-cookie";

import { CookieStorage } from "@/storage/utils/cookieStorage";

export class AuthCookieStorage {
  private static readonly AUTH_TOKEN = "AUTH_TOKEN";
  private static readonly AUTH_EXPIRE_DATE = "AUTH_EXPIRE_DATE";
  private static readonly AUTH_USER_ID = "AUTH_USER_ID";
  private static readonly COOKIE_EXPIRES = 360;

  static get(): {
    token: string | null;
    expireDate: Date | null;
    userId: number | null;
  } {
    const token = CookieStorage.get(AuthCookieStorage.AUTH_TOKEN) || null;
    const expires =
      CookieStorage.get(AuthCookieStorage.AUTH_EXPIRE_DATE) || null;
    const userId = CookieStorage.get(AuthCookieStorage.AUTH_USER_ID) || null;

    const expireDate = expires ? new Date(Number(expires)) : null;

    return { token, expireDate, userId };
  }

  static set(
    token: string,
    expires: Date,
    userId: number,
    options?: CookieAttributes
  ) {
    const config = options || {
      expires: AuthCookieStorage.COOKIE_EXPIRES,
      secure: true,
    };

    CookieStorage.set(AuthCookieStorage.AUTH_TOKEN, token, config);
    CookieStorage.set(
      AuthCookieStorage.AUTH_EXPIRE_DATE,
      String(expires.getTime()),
      config
    );
    if (userId !== undefined) {
      CookieStorage.set(AuthCookieStorage.AUTH_USER_ID, String(userId), config);
    }
  }

  static clear() {
    CookieStorage.remove(AuthCookieStorage.AUTH_TOKEN);
    CookieStorage.remove(AuthCookieStorage.AUTH_EXPIRE_DATE);
    CookieStorage.remove(AuthCookieStorage.AUTH_USER_ID);
  }
}
