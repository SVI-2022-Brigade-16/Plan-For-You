import { ApiProperty } from "@nestjs/swagger"
import { BlockedTimeslot } from "@prisma/client"
import { stringify } from "querystring"
import { MeetingPlanDto } from "../meeting-plan.dto"
import { TimeslotDto } from "../timeslot.dto"

export class PublishMeetingPlanRequest extends MeetingPlanDto {

  @ApiProperty({ type: () => [TimeslotDto] })
  blockedTimeslots: TimeslotDto[]
}
