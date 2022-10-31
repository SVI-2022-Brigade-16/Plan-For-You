import { Module } from '@nestjs/common'
import { PlanMeetingController } from './plan-meeting.controller'
import { PlanMeetingService } from './plan-meeting.service'


@Module({
  controllers: [PlanMeetingController],
  providers: [PlanMeetingService]
})
export class PlanMeetingModule { }
