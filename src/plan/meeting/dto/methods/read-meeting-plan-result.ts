import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlanWithAnswerRatings } from '../objects/meeting-plan-with-rating.dto'
import { MeetingPlan } from '../objects/meeting-plan.dto'
import { TotalRatedTimeslot } from '../objects/total-rated-timeslot.dto'

export namespace ReadMeetingPlanResult {

  export class Response extends MeetingPlan {

    @ApiProperty()
    answerCount: number

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
        plan.startTimeMinutes,
        plan.ratingMax
      )
      this.answerCount = plan.answers.length
      this.sortedTotalRatedTimeslots = sortedTotalRatedTimeslots
    }

  }
}