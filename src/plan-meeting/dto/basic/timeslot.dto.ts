import { ApiProperty } from '@nestjs/swagger'

export class Timeslot {

  @ApiProperty()
  dayNum: number

  @ApiProperty()
  timeslotNum: number

  constructor(dayNum: number, timeslotNum: number) {
    this.dayNum = dayNum
    this.timeslotNum = timeslotNum
  }

  static compare(timeslot1: Timeslot, timeslot2: Timeslot) {
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

  static makeKey(dayNum: number, timeslotNum: number): string {
    return dayNum + '-' + timeslotNum
  }

  static makeKeyFromTimeslot(timeslot: Timeslot): string {
    return this.makeKey(timeslot.dayNum, timeslot.timeslotNum)
  }

}