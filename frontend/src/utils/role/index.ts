import { UserInterface } from "@/services/api/decoders/user/userDecoder";
import { ROLE_ADMIN } from "@/utils/role/enum";

export class RoleProvider {
  public static isAdmin(user: UserInterface): boolean {
    return user.roles.includes(ROLE_ADMIN);
  }
}
