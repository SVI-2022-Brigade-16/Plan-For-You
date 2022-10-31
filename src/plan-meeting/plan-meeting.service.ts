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
import { CalculateMeetingPlanResponse } from './dto/response/calculate-meeting-plan.response'
import { TotalRatedTimeslotDto } from './dto/basic/total-rated-timeslot.dto'
import { NamedRatedTimeslotDto } from './dto/basic/named-rated-timeslot.dto'

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
            ratedTimeslots: {
              select: {
                dayNum: true,
                timeslotNum: true,
                rating: true,
              }
            },
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
    console.log(request)
    let requestObject = new CreateMeetingAnswerRequest(request.participantName, request.ratedTimeslots)
    await requestObject.validate(planUuid, this.prismaService)
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



  async calculateMeetingPlan(planUuid: string): Promise<CalculateMeetingPlanResponse> {
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
      let totalRated: TotalRatedTimeslotDto[] = []

      let sortedBlocked: TimeslotDto[] = meetingPlan.blockedTimeslots.sort(TimeslotDto.compare)

      let bTIndex = 0

      for (let dayNum = 1; dayNum < dayCount + 1; dayNum++) {
        for (let timeslotNum = 1; timeslotNum < timeslotsInDayCount + 1; timeslotNum++) {

          let newTotalRated = {
            dayNum: dayNum,
            timeslotNum: timeslotNum,
            rating: meetingPlan.answers.length * meetingPlan.ratingRange,
            lowerRatingParticipantNames: []
          }

          if (
            bTIndex < sortedBlocked.length &&
            TimeslotDto.compare(sortedBlocked[bTIndex], newTotalRated) == 0
          ) {
            bTIndex++
            continue
          }

          totalRated.push(newTotalRated)

        }
      }


      /* TODO: OPTIMIZE - START */

      let allNamedRated: NamedRatedTimeslotDto[] = []
      meetingPlan.answers.forEach((answer) => {
        answer.ratedTimeslots.forEach((timeslot) => {
          allNamedRated.push({
            participantName: answer.participantName,
            dayNum: timeslot.dayNum,
            timeslotNum: timeslot.timeslotNum,
            rating: timeslot.rating
          })
        })
      })


      allNamedRated.sort(TimeslotDto.compare)

      let j = 0
      for (let i = 0; i < totalRated.length && j < allNamedRated.length; ++i) {
        while (TimeslotDto.compare(totalRated[i], allNamedRated[j]) == 0) {
          totalRated[i].rating += allNamedRated[j].rating - meetingPlan.ratingRange
          if (allNamedRated[j].rating < meetingPlan.ratingRange) {
            totalRated[i].lowerRatingParticipantNames.push(allNamedRated[j].participantName)
          }
          j += 1
          if (j >= allNamedRated.length) {
            break
          }
        }
      }

      /* TODO: OPTIMIZE - END */

      let sortedTotalRated = totalRated.sort(RatedTimeslotDto.compareRating).reverse()

      return { sortedTotalRatedTimeslots: sortedTotalRated }
    }
    throw new HttpException("Couldn't find meeting plan to calculate", 404)
  }

  async removeMeetingPlan(planUuid: string) {
    return await this.prismaService.meetingPlan.delete({ where: { uuid: planUuid } })
  }

}
