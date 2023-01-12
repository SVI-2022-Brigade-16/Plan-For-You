import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlan } from '../objects/meeting-plan.dto'
import { Timeslot } from '../objects/timeslot.dto'
export namespace UpdateMeetingPlan {

  export class Request extends MeetingPlan {

    @ApiProperty({ type: () => [Timeslot] })
    blockedTimeslots: Timeslot[]

  }

}