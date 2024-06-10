import Model from "@/appEntry/Model";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import { reactive } from "vue";

export default class MeetModel extends Model {
  @IsNotEmpty()
  public theme: string = "";

  @IsString()
  public description: string = "";

  @IsDateString()
  @IsNotEmpty()
  public dateTime: string = "";

  constructor() {
    super(["theme", "description", "dateTime"]);
  }
}
