import { ApiProperty } from '@nestjs/swagger'
import { IsIn } from 'class-validator'
import { Timeslot } from './timeslot.dto'

export class RatedTimeslot extends Timeslot {

  @ApiProperty()
  @IsIn([1, 2, 3, 4, 5])
  rating: number

  constructor(ratedTimeslot: RatedTimeslot) {
    super(ratedTimeslot.dayNum, ratedTimeslot.timeslotNum)
    this.rating = ratedTimeslot.rating
  }

  static compareRating(timeslot1: RatedTimeslot, timeslot2: RatedTimeslot) {
    if (timeslot1.rating > timeslot2.rating) {
      return 1
    }
    if (timeslot1.rating < timeslot2.rating) {
      return -1
    }
    return 0
  }

}