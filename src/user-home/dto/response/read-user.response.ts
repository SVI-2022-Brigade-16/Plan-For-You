import { ApiProperty } from '@nestjs/swagger'
import { UserMeetingPlan } from '../basic/user-meeting-plan.dto'

export class ReadUserResponse {

  @ApiProperty()
  nickname: string

  @ApiProperty()
  meetingPlans: UserMeetingPlan[]

}
