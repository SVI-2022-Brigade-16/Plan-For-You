import { ApiProperty } from "@nestjs/swagger"
import { RatedTimeslotDto } from "../basic/rated-timeslot.dto"

export class CreateMeetingAnswerRequest {

  @ApiProperty()
  participantName: string

  @ApiProperty({ type: () => [RatedTimeslotDto] })
  ratedTimeslots: RatedTimeslotDto[]

}
