import { IsNotEmpty, IsString } from "class-validator"

export class CreatePlanMeetingResponse {

  @IsNotEmpty()
  @IsString()
  planUuid: string

}
