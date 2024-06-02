import { reactive } from "vue";

export default class ChatActions {
  public enableVideo = false;
  public enableAudio = false;
  public enableDemonstration = false;
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

  toggleDemonstration() {
    this.enableDemonstration = !this.enableDemonstration;
    if (this.enableDemonstration) this.enableVideo = false;
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
