import { Injectable } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './response/create-meeting-plan.response'
import { PrismaService } from '../prisma/prisma.service'
import { ReadMeetingPlanResponse } from './response/read-meeting-plan.response'
import { EmptyError } from 'rxjs'
import { PublishMeetingPlanRequest } from './request/publish-meeting-plan.request'

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
      }
    })
    return { planUuid: result.uuid }
  }

  async readPlanMeeting(planUuid: string): Promise<ReadMeetingPlanResponse> {

    let result = await this.prismaService.meetingPlan.findFirst({
      where: {
        uuid: planUuid
      },
      include: {
        blockedTimeslots: true,
        answers: true
      }
    })

    if (result) {
      return {
        planName: result.planName,
        weekCount: result.weekCount,
        timeslotLengthMinutes: result.timeslotLengthMinutes,
        timeslotStartTimeMinutes: result.timeslotStartTimeMinutes,
        ratingRange: result.ratingRange,
        blockedTimeslots: result.blockedTimeslots,
        answers: result.answers
      }
    }
    else {
      throw EmptyError
    }
  }

  async publishMeetingPlan(planUuid, request: PublishMeetingPlanRequest): Promise<void> {
    let updateMeetingPlan = await this.prismaService.meetingPlan.update({
      where: {
        uuid: planUuid
      },
      include: {
        blockedTimeslots: true
      },
      data: {
        planName: request.planName,
        weekCount: request.weekCount,
        timeslotLengthMinutes: request.timeslotLengthMinutes,
        timeslotStartTimeMinutes: request.timeslotStartTimeMinutes,
        ratingRange: request.ratingRange,
        receivingAnswers: true,
        blockedTimeslots: {
          deleteMany: {},
          create: request.blockedTimeslots,
        }
      },
    })
  }


}
