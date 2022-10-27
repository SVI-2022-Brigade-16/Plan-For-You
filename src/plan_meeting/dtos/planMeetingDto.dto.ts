export class PlanMeetingDto{
   
    userID: number
    weekCount?: number = 1
    timeslotLengthMinutes?: number = 30
    timeslotStartTimeMinutes?: number = 0
}