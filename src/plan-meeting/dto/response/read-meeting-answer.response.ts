import { MeetingPlanDto } from "../basic/meeting-plan.dto"
import { TimeslotDto } from "../basic/timeslot.dto"

export class ReadMeetingAnswerResponse extends MeetingPlanDto {
  blockedTimeslots: TimeslotDto[]
} 