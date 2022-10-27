import { IsNotEmpty, IsNumber } from "class-validator"

export class CreatePlanMeetingDto {

  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNumber()
  weekCount?: number = 1

  @IsNumber()
  timeslotLengthMinutes?: number = 30

  @IsNumber()
  timeslotStartTimeMinutes?: number = 0

}