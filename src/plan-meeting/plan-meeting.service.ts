import { HttpException, Injectable } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { PrismaService } from '../prisma/prisma.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { PublishMeetingPlanRequest } from './dto/request/publish-meeting-plan.request'
import { ReadMeetingAnswerResponse } from './dto/response/read-meeting-answer.response'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'
import { TimeslotDto } from './dto/basic/timeslot.dto'
import { RatedTimeslotDto } from './dto/basic/rated-timeslot.dto'

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



  async calculateMeetingPlan(planUuid: string) {
    let meetingPlan = await this.prismaService.meetingPlan.findFirst({
      where: {
        uuid: planUuid,
      },
      include: {
        blockedTimeslots: true,
        answers: {
          include: {
            ratedTimeslots: true
          }
        },
      }
    })
    if (meetingPlan) {
      let timeslotsInDayCount = (1440 - meetingPlan.timeslotStartTimeMinutes) / meetingPlan.timeslotLengthMinutes
      let dayCount = meetingPlan.weekCount * 7
      let totalRatedTimeslots: RatedTimeslotDto[] = []

      let sortedBlockedTimeslots: TimeslotDto[] = meetingPlan.blockedTimeslots.sort(TimeslotDto.compare)

      let bTIndex = 0

      for (let dayNum = 1; dayNum < dayCount + 1; dayNum++) {
        for (let timeslotNum = 1; timeslotNum < timeslotsInDayCount + 1; timeslotNum++) {
          if (TimeslotDto.compare(sortedBlockedTimeslots[bTIndex], { dayNum: dayNum, timeslotNum: timeslotNum }) == 0) {
            bTIndex++
            continue
          }
          totalRatedTimeslots.push({
            dayNum: dayNum,
            timeslotNum: timeslotNum,
            rating: meetingPlan.answers.length * meetingPlan.ratingRange,
          })
        }
      }

      let allAnswers: RatedTimeslotDto[] = []
      meetingPlan.answers.forEach((answer) => {
        answer.ratedTimeslots.forEach((timeslot) => {
          allAnswers.push(timeslot)
        })
      })

      allAnswers.sort(TimeslotDto.compare)

      let allAnswersOffset = 0
      for (let i = 0; i < totalRatedTimeslots.length; ++i) {
        while (TimeslotDto.compare(totalRatedTimeslots[i], allAnswers[i + allAnswersOffset]) == 0) {
          totalRatedTimeslots[i].rating += allAnswers[i + allAnswersOffset].rating - meetingPlan.ratingRange
          allAnswersOffset += 1
        }
      }
    }
  }

}
