import { MeetingPlan } from '@prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../../prisma/prisma.service'

import { MeetingPlanWithAnswerRatings } from './dto/objects/meeting-plan-with-rating.dto'
import { MeetingAnswerWithRatings } from './dto/objects/meeting-answer-with-ratings.dto'
import { MeetingAnswerForm } from './dto/objects/meeting-answer-choice.dto'

import { CreateMeetingPlan } from './dto/methods/create-meeting-plan'
import { CreateMeetingAnswer } from './dto/methods/create-meeting-answer'
import { ReadMeetingPlan } from './dto/methods/read-meeting-plan'
import { UpdateMeetingPlan } from './dto/methods/update-meeting-plan'


@Injectable()
export class PlanMeetingPrisma {

  constructor(public prisma: PrismaService) { }

  throwPlanNotFound(planUuid: string): never {
    throw new NotFoundException('Exception: Meeting plan ' + planUuid + ' not found')
  }

  async planBelongsToUser(userId: number, planUuid: string): Promise<boolean> {
    const plan = await this.prisma.meetingPlan.findFirst({
      where: {
        uuid: planUuid,
        userId: userId,
      }
    })
    return plan != null
  }

  async createMeetingPlan(userId: number, req: CreateMeetingPlan.Request, receivingAnswers: boolean): Promise<MeetingPlan> {
    return await this.prisma.meetingPlan.create({
      data: {
        userId: userId,
        planName: req.planName,
        weekCount: req.weekCount,
        timeslotLengthMinutes: req.timeslotLengthMinutes,
        startTimeMinutes: req.startTimeMinutes,
        ratingMax: req.ratingMax,
        receivingAnswers: receivingAnswers,
      }
    })
  }

  async readMeetingPlanNoAnswerRatings(planUuid: string): Promise<ReadMeetingPlan.Response> {
    try {
      return await this.prisma.meetingPlan.findFirstOrThrow({
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



  async readPlanWithAnswerRatings(planUuid: string): Promise<MeetingPlanWithAnswerRatings> {
    try {
      return await this.prisma.meetingPlan.findFirstOrThrow({
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

  async updateMeetingPlan(planUuid: string, req: UpdateMeetingPlan.Request): Promise<void> {
    try {
      await this.prisma.meetingPlan.update({
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
          startTimeMinutes: req.startTimeMinutes,
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
      await this.prisma.meetingPlan.delete({
        where: {
          uuid: planUuid
        }
      })
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async updatePublishing(planUuid: string, state: number) {
    try {
      await this.prisma.meetingPlan.update({
        where: {
          uuid: planUuid,
        },
        data: {
          receivingAnswers: state > 0,
        },
      })
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async unpublishMeetingPlan(planUuid: string) {
    try {
      await this.prisma.meetingPlan.update({
        where: {
          uuid: planUuid,
        },
        data: {
          receivingAnswers: false,
        },
      })
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async createMeetingAnswer(planUuid: string, request: CreateMeetingAnswer.Request) {
    let requestInstance = new CreateMeetingAnswer.Request(request.participantName, request.ratedTimeslots)
    await requestInstance.validate(planUuid, this)

    await this.prisma.meetingPlanAnswer.create({
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

  async readAnswer(planUuid: string, answerId: number): Promise<MeetingAnswerWithRatings> {
    try {
      let meetingPlan = await this.prisma.meetingPlan.findFirstOrThrow({
        select: {
          answers: {
            select: {
              id: true,
              participantName: true,
              ratedTimeslots: {
                select: {
                  dayNum: true,
                  timeslotNum: true,
                  rating: true
                }
              }
            }
          }
        },
        where: {
          uuid: planUuid
        },
      })
      for (let i = 0; i < meetingPlan.answers.length; i++) {
        if (meetingPlan.answers[i].id == answerId) {
          return meetingPlan.answers[i]
        }
      }
      throw new NotFoundException('Exception: Meeting plan ' + planUuid + ' answer ' + answerId + ' not found')
    } catch {
      throw this.throwPlanNotFound(planUuid)
    }
  }

  async readMeetingAnswerForm(planUuid: string): Promise<MeetingAnswerForm> {
    try {
      return await this.prisma.meetingPlan.findFirstOrThrow({
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
}
