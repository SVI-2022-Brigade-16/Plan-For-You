import { MeetingPlanDto } from "../meeting-plan.dto"
import { TimeslotDto } from "../timeslot.dto"

export class ReadMeetingAnswerResponse extends MeetingPlanDto {
  blockedTimeslots: TimeslotDto[]
} 