import { Module } from '@nestjs/common'
import { PlanMeetingController } from './plan-meeting.controller'
import { PlanMeetingPrisma } from './plan-meeting.prisma'
import { PlanMeetingService } from './plan-meeting.service'


@Module({
  controllers: [PlanMeetingController],
  providers: [PlanMeetingService, PlanMeetingPrisma]
})
export class PlanMeetingModule { }
