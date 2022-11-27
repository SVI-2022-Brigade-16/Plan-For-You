import { Module } from '@nestjs/common'
import { PlanMeetingApiController } from './plan-meeting.controller.api'
import { PlanMeetingViewController } from './plan-meeting.controller.view'
import { PlanMeetingPrisma } from './plan-meeting.prisma'
import { PlanMeetingService } from './plan-meeting.service'


@Module({
  controllers: [PlanMeetingApiController, PlanMeetingViewController],
  providers: [PlanMeetingService, PlanMeetingPrisma]
})
export class PlanMeetingModule { }
