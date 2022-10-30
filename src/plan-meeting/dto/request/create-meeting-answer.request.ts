import { ApiProperty } from "@nestjs/swagger"
import { RatedTimeslotDto } from "../rating.dto"

export class CreateMeetingAnswerRequest {

  @ApiProperty()
  participantName: string

  @ApiProperty({ type: () => [RatedTimeslotDto] })
  ratedTimeslots: RatedTimeslotDto[]
}
