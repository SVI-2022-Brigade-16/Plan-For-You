import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswerRating } from './meeting-answer-rating.dto'
import { RatedTimeslot } from './rated-timeslot.dto'

export class TotalRatedTimeslot extends RatedTimeslot {

  @ApiProperty()
  lowerThanMaxRatings: MeetingAnswerRating[]

}