import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlan } from '../basic/meeting-plan.dto'
import { Timeslot } from '../basic/timeslot.dto'

export class MeetingAnswerConditions extends MeetingPlan {

  @ApiProperty()
  receivingAnswers: boolean

  @ApiProperty()
  blockedTimeslots: Timeslot[]

} 