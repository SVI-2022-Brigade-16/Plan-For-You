import { ApiProperty } from '@nestjs/swagger'
import { IsIn, Max, Min } from 'class-validator'

export class MeetingPlan {

  @ApiProperty()
  uuid: string

  @ApiProperty()
  planName: string = "Новый план"

  @ApiProperty({
    default: 1
  })
  @IsIn([1, 2, 4])
  weekCount: number = 1

  @ApiProperty({
    default: 30
  })
  @IsIn([30, 45, 60, 90, 120])
  timeslotLengthMinutes: number = 30

  @ApiProperty({
    default: 0
  })
  @Min(0)
  @Max(1200)
  timeslotStartTimeMinutes: number = 0

  @ApiProperty({
    default: 2
  })
  @Min(2)
  @Max(5)
  ratingMax: number = 2

  constructor(
    planName: string = "Новый план",
    weekCount: number = 1,
    timeslotLengthMinutes: number = 30,
    timeslotStartTimeMinutes: number = 0,
    ratingMax: number = 2,
  ) {
    this.planName = planName
    this.weekCount = weekCount
    this.timeslotLengthMinutes = timeslotLengthMinutes
    this.timeslotStartTimeMinutes = timeslotStartTimeMinutes
    this.ratingMax = ratingMax
  }

}