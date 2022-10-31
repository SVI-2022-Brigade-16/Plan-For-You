import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { PrismaService } from '../prisma/prisma.service'
import { PlanMeetingController } from './plan-meeting.controller'
import { PlanMeetingService } from './plan-meeting.service'


@Module({
  controllers: [PlanMeetingController],
  providers: [
    PlanMeetingService,
    PrismaService,
  ]
})
export class PlanMeetingModule { }
