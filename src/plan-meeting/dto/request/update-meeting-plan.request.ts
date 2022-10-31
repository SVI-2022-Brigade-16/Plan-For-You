import { ApiProperty } from "@nestjs/swagger"
import { MeetingPlanDto } from "../basic/meeting-plan.dto"
import { TimeslotDto } from "../basic/timeslot.dto"

export class UpdateMeetingPlanRequest extends MeetingPlanDto {

  @ApiProperty({ type: () => [TimeslotDto] })
  blockedTimeslots: TimeslotDto[]
}
