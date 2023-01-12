import { Module } from '@nestjs/common'
import { PlanMeetingViewController } from './plan-meeting.controller.view'
import { PlanMeetingBaseModule } from './plan-meeting.module.base'


@Module({
  imports: [PlanMeetingBaseModule],
  controllers: [PlanMeetingViewController]
})
export class PlanMeetingModule { }
