import { ApiProperty } from '@nestjs/swagger'
import { IsIn, Max, Min } from 'class-validator'

export class MeetingPlan {

  @ApiProperty()
  planName: string

  @ApiProperty({
    default: 1
  })
  @IsIn([1, 2, 4])
  weekCount: number

  @ApiProperty({
    default: 30
  })
  @IsIn([30, 45, 60, 90, 120])
  timeslotLengthMinutes: number

  @ApiProperty({
    default: 0
  })
  @Min(0)
  @Max(1200)
  timeslotStartTimeMinutes: number

  @ApiProperty({
    default: 2
  })
  @Min(2)
  @Max(5)
  ratingMax: number

  constructor(
    planName: string,
    weekCount: number,
    timeslotLengthMinutes: number,
    timeslotStartTimeMinutes: number,
    ratingMax: number,
  ) {
    this.planName = planName
    this.weekCount = weekCount
    this.timeslotLengthMinutes = timeslotLengthMinutes
    this.timeslotStartTimeMinutes = timeslotStartTimeMinutes
    this.ratingMax = ratingMax
  }

}