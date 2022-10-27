import { IsNotEmpty, IsString } from "class-validator"

export class CreatePlanMeetingRequest {

  @IsNotEmpty()
  @IsString()
  accessToken: string

  @IsNotEmpty()
  @IsString()
  planName: string

}
