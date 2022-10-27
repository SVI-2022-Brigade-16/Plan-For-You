import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanMeetingController } from './plan_meeting.controller';
import { PlanMeetingService } from './plan_meeting.service';


@Module({
  controllers: [PlanMeetingController],
  providers: [PlanMeetingService, PrismaService]
})
export class PlanMeetingModule {}
