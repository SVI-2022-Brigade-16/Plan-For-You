import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlanDto } from '../basic/meeting-plan.dto'
import { TotalRatedTimeslotDto } from '../basic/total-rated-timeslot.dto'

export class CalculateMeetingPlanResponse extends MeetingPlanDto {

  @ApiProperty()
  sortedTotalRatedTimeslots: TotalRatedTimeslotDto[]

}
