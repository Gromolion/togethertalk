import { reactive } from "vue";

export default class ChatActions {
  public enableVideo = false;
  public enableAudio = false;
  public showChat = false;
  public showUsers = true;

  constructor() {
    return reactive(this);
  }

  toggleVideo() {
    this.enableVideo = !this.enableVideo;
  }

  toggleAudio() {
    this.enableAudio = !this.enableAudio;
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) this.showUsers = false;
  }

  toggleUsers() {
    this.showUsers = !this.showUsers;
    if (this.showUsers) this.showChat = false;
  }
}
