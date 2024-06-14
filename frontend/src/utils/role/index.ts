import { UserInterface } from "@/services/api/decoders/user/userDecoder";
import { ROLE_ADMIN, ROLE_USER } from "@/utils/role/enum";

export class RoleProvider {
  private static ROLES_REPRESENTATION = {
    [ROLE_USER]: "Пользователь",
    [ROLE_ADMIN]: "Администратор",
  };

  public static isAdmin(user: UserInterface): boolean {
    return user.roles.includes(ROLE_ADMIN);
  }

  public static representation(user: UserInterface): string {
    return user.roles.map((role) => this.ROLES_REPRESENTATION[role]).join(", ");
  }
}
