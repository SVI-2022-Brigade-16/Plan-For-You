import { Module } from '@nestjs/common'
import { PlanMeetingAnswerApiController } from './plan-meeting.controller.answer.api'
import { PlanMeetingApiController } from './plan-meeting.controller.api'
import { PlanMeetingPrisma } from './plan-meeting.prisma'
import { PlanMeetingService } from './plan-meeting.service'


@Module({
  controllers: [PlanMeetingApiController, PlanMeetingAnswerApiController],
  providers: [PlanMeetingService, PlanMeetingPrisma],
  exports: [PlanMeetingService]
})
export class PlanMeetingBaseModule { }
