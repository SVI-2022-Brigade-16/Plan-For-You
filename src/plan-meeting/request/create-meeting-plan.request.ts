import { IsIn, Max, Min } from "class-validator"

export class CreateMeetingPlanRequest {

  planName: string

  @IsIn([1, 2, 4])
  weekCount: number

  @IsIn([30, 45, 60, 90, 120])
  timeslotLengthMinutes: number

  @Min(0)
  @Max(1200)
  timeslotStartTimeMinutes: number

  @Min(2)
  @Max(5)
  ratingRange: number

}
