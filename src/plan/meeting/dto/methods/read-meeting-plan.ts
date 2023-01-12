import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswer } from '../objects/meeting-answer.dto'
import { MeetingPlan } from '../objects/meeting-plan.dto'
import { Timeslot } from '../objects/timeslot.dto'
import { UserIdentity } from '../objects/user-identity.dto'

export namespace ReadMeetingPlan {

  export class Response extends MeetingPlan {

    @ApiProperty()
    user: UserIdentity

    @ApiProperty()
    receivingAnswers: boolean

    @ApiProperty()
    blockedTimeslots: Timeslot[]

    @ApiProperty()
    answers: MeetingAnswer[]

  }

}
