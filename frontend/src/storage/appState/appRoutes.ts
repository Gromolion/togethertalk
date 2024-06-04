export default class {
  public static getMainUrl = () => "/";
  public static getMainCalendarUrl = () => "/calendar";
  public static getAuthorizationUrl = () => "/auth";
  public static getResetPasswordUrl = () => "/auth/reset-password";
  public static getResetPasswordByHashUrl = () => "/auth/reset-password/:hash";
  public static getChatRoomUrl = () => "/chat-room";
}
