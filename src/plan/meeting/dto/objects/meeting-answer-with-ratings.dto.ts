import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswer } from './meeting-answer.dto'
import { RatedTimeslot } from './rated-timeslot.dto'

export class MeetingAnswerWithRatings extends MeetingAnswer {

  @ApiProperty()
  ratedTimeslots: RatedTimeslot[]

}