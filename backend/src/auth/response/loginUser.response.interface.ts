import { User } from 'src/entities/user.entity';

export default interface LoginUserResponseInterface {
  user: User;
  token: string;
  expiresIn: number;
}
