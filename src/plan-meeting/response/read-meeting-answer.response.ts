import { BlockedTimeslot } from "@prisma/client"
import { MeetingPlanDto } from "../basics/meeting-plan.dto"

export class ReadMeetingAnswerResponse extends MeetingPlanDto {
  blockedTimeslots: BlockedTimeslot[]
} 