import { ApiProperty } from "@nestjs/swagger"

export class TimeslotDto {
  @ApiProperty()
  dayNum: number

  @ApiProperty()
  timeslotNum: number

  static compare(timeslot1: TimeslotDto, timeslot2: TimeslotDto) {
    if (timeslot1.dayNum > timeslot2.dayNum) {
      return 1
    }
    if (timeslot1.dayNum < timeslot2.dayNum) {
      return -1
    }
    if (timeslot1.timeslotNum > timeslot2.timeslotNum) {
      return 1
    }
    if (timeslot1.timeslotNum < timeslot2.timeslotNum) {
      return -1
    }
    return 0
  }
}