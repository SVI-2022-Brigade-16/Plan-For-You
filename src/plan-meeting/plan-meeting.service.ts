import { HttpException, Injectable } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { PrismaService } from '../prisma/prisma.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { PublishMeetingPlanRequest } from './dto/request/publish-meeting-plan.request'
import { ReadMeetingAnswerResponse } from './dto/response/read-meeting-answer.response'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'

@Injectable()
export class PlanMeetingService {

  constructor(private prismaService: PrismaService) { }

  async createMeetingPlan(userId: number, request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {
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

  async readMeetingPlan(planUuid: string): Promise<ReadMeetingPlanResponse> {
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
        answers: {
          select: {
            id: true,
            participantName: true,
          }
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
        answers: result.answers
      }
    } else {
      throw new HttpException("Couldn't find meeting plan record.", 404)
    }
  }

  async publishMeetingPlan(planUuid: string, request: PublishMeetingPlanRequest): Promise<void> {
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
      throw new HttpException("Couldn't find meeting plan to publish.", 404)
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
      throw new HttpException("Couldn't find meeting plan to answer.", 404)
    }
  }

  async createMeetingAnswer(planUuid: string, request: CreateMeetingAnswerRequest): Promise<void> {
    let result = await this.prismaService.meetingPlanAnswer.create({
      include: {
        ratedTimeslots: true
      },
      data: {
        meetingPlanUuid: planUuid,
        participantName: request.participantName,
        ratedTimeslots: {
          create: request.ratedTimeslots,
        }
      }
    })
    if (!result) {
      throw new HttpException("Couldn't create answer to meeting plan.", 400)
    }
  }

}
