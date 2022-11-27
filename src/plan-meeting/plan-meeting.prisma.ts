import { MeetingPlan } from '@prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ReadMeetingPlanResponse } from '../plan-meeting/dto/response/read-meeting-plan.response'
import { UpdateMeetingPlanRequest } from '../plan-meeting/dto/request/update-meeting-plan.request'
import { CreateMeetingPlanRequest } from '../plan-meeting/dto/request/create-meeting-plan.request'
import { MeetingAnswerConditions } from '../plan-meeting/dto/basic/meeting-answer-conditions.dto'
import { PrismaService } from '../base-prisma/prisma.service'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'
import { MeetingPlanWithAnswerRatings } from './dto/basic/meeting-plan-with-rating.dto'

@Injectable()
export class PlanMeetingPrisma {

  constructor(public prismaService: PrismaService) { }

  throwPlanNotFound(planUuid: string): never {
    throw new NotFoundException('Exception: Meeting plan ' + planUuid + ' not found')
  }

  async planBelongsToUser(userId: number, planUuid: string): Promise<boolean> {
    const plan = await this.prismaService.meetingPlan.findFirst({
      where: {
        uuid: planUuid,
        userId: userId,
      }
    })
    return plan != null
  }

  async createMeetingPlan(userId: number, req: CreateMeetingPlanRequest, receivingAnswers: boolean): Promise<MeetingPlan> {
    return await this.prismaService.meetingPlan.create({
      data: {
        userId: userId,
        planName: req.planName,
        weekCount: req.weekCount,
        timeslotLengthMinutes: req.timeslotLengthMinutes,
        timeslotStartTimeMinutes: req.timeslotStartTimeMinutes,
        ratingMax: req.ratingMax,
        receivingAnswers: receivingAnswers,
      }
    })
  }

  async readMeetingPlanNoAnswerRatings(planUuid: string): Promise<ReadMeetingPlanResponse> {
    try {
      return await this.prismaService.meetingPlan.findFirstOrThrow({
        where: {
          uuid: planUuid,
        },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
            }
          },
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
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }



  async readMeetingPlanWithAnswerRatings(planUuid: string): Promise<MeetingPlanWithAnswerRatings> {
    try {
      return await this.prismaService.meetingPlan.findFirstOrThrow({
        where: {
          uuid: planUuid,
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
              ratedTimeslots: {
                select: {
                  dayNum: true,
                  timeslotNum: true,
                  rating: true,
                }
              },
            }
          }
        }
      })
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async updateMeetingPlan(planUuid: string, req: UpdateMeetingPlanRequest): Promise<void> {
    try {
      await this.prismaService.meetingPlan.update({
        where: {
          uuid: planUuid
        },
        include: {
          blockedTimeslots: true,
        },
        data: {
          planName: req.planName,
          weekCount: req.weekCount,
          timeslotLengthMinutes: req.timeslotLengthMinutes,
          timeslotStartTimeMinutes: req.timeslotStartTimeMinutes,
          ratingMax: req.ratingMax,
          blockedTimeslots: {
            deleteMany: {},
            create: req.blockedTimeslots,
          }
        },
      })
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async deleteMeetingPlan(planUuid: string) {
    try {
      await this.prismaService.meetingPlan.delete({
        where: {
          uuid: planUuid
        }
      })
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async publishMeetingPlan(planUuid: string) {
    try {
      await this.prismaService.meetingPlan.update({
        where: {
          uuid: planUuid,
        },
        data: {
          receivingAnswers: true,
        },
      })
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async readMeetingAnswerConditions(planUuid: string): Promise<MeetingAnswerConditions> {
    try {
      return await this.prismaService.meetingPlan.findFirstOrThrow({
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
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async createMeetingAnswer(planUuid: string, request: CreateMeetingAnswerRequest) {
    let requestInstance = new CreateMeetingAnswerRequest(request.participantName, request.ratedTimeslots)
    await requestInstance.validate(planUuid, this.prismaService)

    await this.prismaService.meetingPlanAnswer.create({
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
  }
}
