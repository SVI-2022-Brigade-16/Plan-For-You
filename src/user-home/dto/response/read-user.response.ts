import { ApiProperty } from '@nestjs/swagger'
import { UserMeetingPlanDto } from '../basic/user-meeting-plan.dto'

export class ReadUserResponse {

  @ApiProperty()
  nickname: string

  @ApiProperty()
  meetingPlans: UserMeetingPlanDto[]

}
