import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswerDto } from '../basic/meeting-answer.dto'
import { MeetingPlanDto } from '../basic/meeting-plan.dto'
import { TimeslotDto } from '../basic/timeslot.dto'

export class ReadMeetingPlanResponse extends MeetingPlanDto {

  @ApiProperty()
  blockedTimeslots: TimeslotDto[]

  @ApiProperty()
  answers: MeetingAnswerDto[]

}
