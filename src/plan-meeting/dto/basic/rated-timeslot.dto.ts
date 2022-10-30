import { ApiProperty } from "@nestjs/swagger"
import { IsIn } from "class-validator"
import { TimeslotDto } from "./timeslot.dto"

export class RatedTimeslotDto extends TimeslotDto {

  @ApiProperty()
  @IsIn([1, 2, 3, 4, 5])
  rating: number

  constructor(ratedTimeslot: RatedTimeslotDto) {
    super()
    this.dayNum = ratedTimeslot.dayNum
    this.timeslotNum = ratedTimeslot.timeslotNum
    this.rating = ratedTimeslot.rating
  }

  static compareRating(timeslot1: RatedTimeslotDto, timeslot2: RatedTimeslotDto) {
    if (timeslot1.rating > timeslot2.rating) {
      return 1
    }
    if (timeslot1.rating < timeslot2.rating) {
      return -1
    }
    return 0
  }

}