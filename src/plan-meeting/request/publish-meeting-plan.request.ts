import { ApiProperty } from "@nestjs/swagger"
import { BlockedTimeslot } from "@prisma/client"
import { stringify } from "querystring"
import { MeetingPlanDto } from "../basics/meeting-plan.dto"
import { TimeslotDto } from "../basics/timeslot.dto"

export class PublishMeetingPlanRequest extends MeetingPlanDto {

  @ApiProperty({ type: () => [TimeslotDto] })
  blockedTimeslots: TimeslotDto[]
}
