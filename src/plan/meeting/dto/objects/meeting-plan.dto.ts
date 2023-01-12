import { ApiProperty } from '@nestjs/swagger'
import { IsIn, Max, Min } from 'class-validator'

export class MeetingPlan {

  @ApiProperty()
  uuid: string

  @ApiProperty()
  planName: string

  @ApiProperty({
    default: 1
  })
  @IsIn([1, 2, 4])
  weekCount: number

  @ApiProperty({
    default: 60
  })
  @IsIn([60, 90, 120])
  timeslotLengthMinutes: number

  @ApiProperty({
    default: 0
  })
  @Min(0)
  @Max(1200)
  startTimeMinutes: number

  @ApiProperty({
    default: 2
  })
  @Min(2)
  @Max(5)
  ratingMax: number = 2

  constructor(
    planName: string = "Новый план",
    weekCount: number = 1,
    timeslotLengthMinutes: number = 60,
    startTimeMinutes: number = 0,
    ratingMax: number = 2,
  ) {
    this.planName = planName
    this.weekCount = weekCount
    this.timeslotLengthMinutes = timeslotLengthMinutes
    this.startTimeMinutes = startTimeMinutes
    this.ratingMax = ratingMax
  }

}