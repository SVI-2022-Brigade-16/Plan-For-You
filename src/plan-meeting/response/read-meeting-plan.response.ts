import { BlockedTimeslot, MeetingPlanAnswer } from "@prisma/client"

export class ReadMeetingPlanResponse {

  planName: string

  weekCount: number

  timeslotLengthMinutes: number

  timeslotStartTimeMinutes: number

  ratingRange: number

  blockedTimeslots: BlockedTimeslot[]

  answers: MeetingPlanAnswer[]
}


