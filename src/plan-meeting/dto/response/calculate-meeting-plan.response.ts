import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlanWithAnswerRatings } from '../basic/meeting-plan-with-rating.dto'
import { MeetingPlan } from '../basic/meeting-plan.dto'
import { TotalRatedTimeslot } from '../basic/total-rated-timeslot.dto'

export class CalculateMeetingPlanResponse extends MeetingPlan {

  @ApiProperty()
  sortedTotalRatedTimeslots: TotalRatedTimeslot[]

  constructor(
    plan: MeetingPlanWithAnswerRatings,
    sortedTotalRatedTimeslots: TotalRatedTimeslot[],
  ) {
    super(
      plan.planName,
      plan.weekCount,
      plan.timeslotLengthMinutes,
      plan.timeslotStartTimeMinutes,
      plan.ratingMax
    )
    this.sortedTotalRatedTimeslots = sortedTotalRatedTimeslots
  }

}