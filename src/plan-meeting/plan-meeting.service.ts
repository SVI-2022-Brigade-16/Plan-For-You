import { Injectable } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { PrismaService } from '../prisma/prisma.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { EmptyError } from 'rxjs'
import { PublishMeetingPlanRequest } from './dto/request/publish-meeting-plan.request'
import { ReadMeetingAnswerResponse } from './dto/response/read-meeting-answer.response'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'

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
        blockedTimeslots: {
          select: {
            dayNum: true,
            timeslotNum: true,
          },
        },
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
    if (!updateMeetingPlan) {
      throw EmptyError
    }
  }

  async readMeetingAnswer(planUuid: string): Promise<ReadMeetingAnswerResponse> {
    let result = await this.prismaService.meetingPlan.findFirst({
      where: {
        uuid: planUuid
      },
      include: {

        blockedTimeslots: {
          select: {
            dayNum: true,
            timeslotNum: true,
          },
        }
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
      }
    }
    else {
      throw EmptyError
    }
  }

  async createMeetingAnswer(planUuid: string, request: CreateMeetingAnswerRequest): Promise<void> {

  }

}
