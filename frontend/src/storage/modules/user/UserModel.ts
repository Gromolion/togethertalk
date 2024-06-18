import Model from "@/appEntry/Model";
import { IsNotEmpty, IsString } from "class-validator";
import { UserInterface } from "@/services/api/decoders/user/userDecoder";

export default class UserModel extends Model {
  public id = 0;

  @IsString()
  @IsNotEmpty()
  login: string = "";

  @IsString()
  @IsNotEmpty()
  password: string = "";

  @IsString()
  @IsNotEmpty()
  firstName: string = "";

  @IsString()
  @IsNotEmpty()
  lastName: string = "";

  @IsString()
  @IsNotEmpty()
  email: string = "";

  position: string;

  constructor() {
    super(["login", "password", "firstName", "lastName", "email"]);
  }

  static fromUser(user: UserInterface) {
    const self = new this();
    self.id = user.id;
    self.login = user.login;
    self.firstName = user.firstName;
    self.lastName = user.lastName;
    self.email = user.email;
    self.position = user.position;

    return self;
  }
}
