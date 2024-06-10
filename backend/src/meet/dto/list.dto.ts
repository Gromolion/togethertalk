import { IsDateString, IsNumber } from 'class-validator';

export default class ListDto {
  @IsDateString()
  listAt: string;

  @IsNumber()
  page: number;

  @IsNumber()
  perPage: number;
}
