import { ApiProperty } from "@nestjs/swagger"
import { MeetingAnswerWithRatings } from "./meeting-answer-with-ratings.dto"
import { MeetingPlan } from "./meeting-plan.dto"
import { Timeslot } from "./timeslot.dto"

export class MeetingPlanWithAnswerRatings extends MeetingPlan {

  @ApiProperty()
  blockedTimeslots: Timeslot[]

  @ApiProperty()
  answers: MeetingAnswerWithRatings[]

}