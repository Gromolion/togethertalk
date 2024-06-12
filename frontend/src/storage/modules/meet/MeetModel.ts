import Model from "@/appEntry/Model";
import { IsDateString, IsNotEmpty } from "class-validator";
import { MeetDetailInterface } from "@/services/api/decoders/meet/meetDetailDecoder";

export default class MeetModel extends Model {
  public id: number = 0;

  @IsNotEmpty()
  public theme: string = "";

  public description: string = "";

  @IsDateString()
  @IsNotEmpty()
  public dateTime: string = "";

  constructor() {
    super(["theme", "description", "dateTime"]);
  }

  public static fromMeet(meet: MeetDetailInterface) {
    const self = new this();
    self.id = meet.id;
    self.theme = meet.theme;
    self.description = meet.description;
    self.dateTime = meet.meetAt;
    return self;
  }
}
