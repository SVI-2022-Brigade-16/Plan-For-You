import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswer } from '../basic/meeting-answer.dto'
import { MeetingPlan } from '../basic/meeting-plan.dto'
import { Timeslot } from '../basic/timeslot.dto'
import { UserIdentity } from '../basic/user-identity.dto'

export class ReadMeetingPlanResponse extends MeetingPlan {

  @ApiProperty()
  user: UserIdentity

  @ApiProperty()
  receivingAnswers: boolean

  @ApiProperty()
  blockedTimeslots: Timeslot[]

  @ApiProperty()
  answers: MeetingAnswer[]

}
