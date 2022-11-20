import { ApiProperty } from '@nestjs/swagger'
import { MeetingAnswer } from './meeting-answer.dto'

export class MeetingAnswerRating extends MeetingAnswer {

  @ApiProperty()
  rating: number

  constructor(answer: MeetingAnswer, rating: number) {
    super(answer.id, answer.participantName)
    this.rating = rating
  }

}
