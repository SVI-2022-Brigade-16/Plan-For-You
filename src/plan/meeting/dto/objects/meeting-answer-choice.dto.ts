import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlan } from './meeting-plan.dto'
import { Timeslot } from './timeslot.dto'

export class MeetingAnswerForm extends MeetingPlan {

  @ApiProperty()
  receivingAnswers: boolean

  @ApiProperty()
  blockedTimeslots: Timeslot[]

} 