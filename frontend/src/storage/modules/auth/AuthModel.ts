import { IsNotEmpty } from "class-validator";
import { reactive } from "vue";
import Model from "@/appEntry/Model";

export default class AuthModel extends Model {
  @IsNotEmpty()
  public login: string = '';
  @IsNotEmpty()
  public password: string = '';

  constructor() {
    super(["login", "password"]);

    return reactive(this);
  }
}