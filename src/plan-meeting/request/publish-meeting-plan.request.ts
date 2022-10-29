import { ApiProperty } from "@nestjs/swagger"
import { BlockedTimeslot } from "@prisma/client"

export class PublishMeetingPlanRequest {

  @ApiProperty()
  planName: string

  @ApiProperty()
  weekCount: number

  @ApiProperty()
  timeslotLengthMinutes: number

  @ApiProperty()
  timeslotStartTimeMinutes: number

  @ApiProperty()
  ratingRange: number

  @ApiProperty()
  blockedTimeslots: BlockedTimeslot[]

}