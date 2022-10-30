import { MeetingPlanAnswer } from "@prisma/client"
import { MeetingPlanDto } from "../meeting-plan.dto"
import { TimeslotDto } from "../timeslot.dto"

export class ReadMeetingPlanResponse extends MeetingPlanDto {

  blockedTimeslots: TimeslotDto[]

  answers: MeetingPlanAnswer[]
}


