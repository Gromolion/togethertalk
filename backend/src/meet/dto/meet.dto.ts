import { IsDateString, IsString } from 'class-validator';

export default class MeetDto {
  @IsString({ message: 'Тема не должна быть пустой' })
  theme: string;

  description: string;

  @IsDateString()
  dateTime: string;
}
