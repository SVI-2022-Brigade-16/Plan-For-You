import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswerRatingDto } from './meeting-answer-rating.dto'
import { RatedTimeslotDto } from './rated-timeslot.dto'

export class TotalRatedTimeslotDto extends RatedTimeslotDto {

  @ApiProperty()
  lowerThanMaxRatings: MeetingAnswerRatingDto[]

}