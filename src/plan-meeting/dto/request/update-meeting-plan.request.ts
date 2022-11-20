import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlan } from '../basic/meeting-plan.dto'
import { Timeslot } from '../basic/timeslot.dto'

export class UpdateMeetingPlanRequest extends MeetingPlan {

  @ApiProperty({ type: () => [Timeslot] })
  blockedTimeslots: Timeslot[]
}
