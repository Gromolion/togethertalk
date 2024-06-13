import { IsEmail, IsString } from 'class-validator';

export default class UserDto {
  id: number;

  @IsString({ message: 'Логин не должен быть пустым' })
  login: string;

  password: string;

  @IsString({ message: 'Имя не должно быть пустым' })
  firstName: string;

  @IsString({ message: 'Фамилия не должна быть пустой' })
  lastName: string;

  @IsEmail()
  email: string;

  position: string;
}
