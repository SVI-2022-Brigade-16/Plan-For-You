import { ApiProperty } from "@nestjs/swagger"
import { TotalRatedTimeslotDto } from "../basic/total-rated-timeslot.dto"

export class CalculateMeetingPlanResponse {

  @ApiProperty()
  sortedTotalRatedTimeslots: TotalRatedTimeslotDto[]

}
