import { MeetingPlanAnswer } from "@prisma/client"
import { MeetingPlanDto } from "../basics/meeting-plan.dto"
import { TimeslotDto } from "../basics/timeslot.dto"

export class ReadMeetingPlanResponse extends MeetingPlanDto {

  blockedTimeslots: TimeslotDto[]

  answers: MeetingPlanAnswer[]
}


