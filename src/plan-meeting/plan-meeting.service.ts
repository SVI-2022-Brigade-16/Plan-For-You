import { Injectable } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './response/create-meeting-plan.response'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PlanMeetingService {

  constructor(private prismaService: PrismaService) { }

  async createPlanMeeting(userId: number, request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {

    let result = await this.prismaService.meetingPlan.create({
      data: {
        userId: userId,
        planName: request.planName,
        weekCount: request.weekCount,
        timeslotLengthMinutes: request.timeslotLengthMinutes,
        timeslotStartTimeMinutes: request.timeslotStartTimeMinutes,
        ratingRange: request.ratingRange,
        receivingAnswers: false,
        randomAccessString: null,
      }
    })
    return { planUuid: result.uuid }

  };

}
