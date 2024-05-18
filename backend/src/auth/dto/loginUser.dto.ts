import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Имя не должно быть пустым' })
  login: string;
  @IsString({ message: 'Пароль не должен быть пустым' })
  @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
  password: string;
}

export default LoginUserDto;
