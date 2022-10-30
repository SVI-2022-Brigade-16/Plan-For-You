import { ApiProperty } from "@nestjs/swagger"
import { IsIn, Max, Min } from "class-validator"

export class MeetingPlanDto {

  @ApiProperty()
  planName: string

  @ApiProperty()
  @IsIn([1, 2, 4])
  weekCount: number

  @ApiProperty()
  @IsIn([30, 45, 60, 90, 120])
  timeslotLengthMinutes: number

  @ApiProperty()
  @Min(0)
  @Max(1200)
  timeslotStartTimeMinutes: number

  @ApiProperty()
  @Min(2)
  @Max(5)
  ratingRange: number
}