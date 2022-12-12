import { Module } from '@nestjs/common'
import { PlanMeetingViewController } from './plan-meeting.controller.view'
import { PlanMeetingBaseModule } from './plan-meeting.base.module'


@Module({
  imports: [PlanMeetingBaseModule],
  controllers: [PlanMeetingViewController]
})
export class PlanMeetingModule { }
