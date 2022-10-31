import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswerDto } from './meeting-answer.dto'

export class MeetingAnswerRatingDto extends MeetingAnswerDto {

  @ApiProperty()
  rating: number

  constructor(answer: MeetingAnswerDto, rating: number) {
    super(answer.id, answer.participantName)
    this.rating = rating
  }

}
