import { ApiProperty } from "@nestjs/swagger"
import { RatedTimeslotDto } from "../basics/rating.dto"

export class CreateMeetingAnswerRequest {

  @ApiProperty()
  participantName: string

  @ApiProperty({ type: () => [RatedTimeslotDto] })
  ratings: RatedTimeslotDto[]
}
