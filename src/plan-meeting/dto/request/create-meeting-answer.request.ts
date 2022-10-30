import { ApiProperty } from "@nestjs/swagger"
import { RatedTimeslotDto } from "../rated-timeslot.dto"

export class CreateMeetingAnswerRequest {

  @ApiProperty()
  participantName: string

  @ApiProperty({ type: () => [RatedTimeslotDto] })
  ratedTimeslots: RatedTimeslotDto[]
}
