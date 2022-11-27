import { Module } from '@nestjs/common'
import { PlanMeetingApiController } from './plan-meeting.controller.api'
import { PlanMeetingPrisma } from './plan-meeting.prisma'
import { PlanMeetingService } from './plan-meeting.service'


@Module({
  controllers: [PlanMeetingApiController],
  providers: [PlanMeetingService, PlanMeetingPrisma]
})
export class PlanMeetingModule { }
