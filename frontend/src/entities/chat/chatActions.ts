import { reactive } from "vue";

export default class ChatActions {
  public showChat = false;
  public showUsers = false;

  constructor() {
    return reactive(this);
  }
}
