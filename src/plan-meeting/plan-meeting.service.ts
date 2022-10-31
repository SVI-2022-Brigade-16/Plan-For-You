import { HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { PrismaService } from '../app-prisma/prisma.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { ReadMeetingAnswerResponse } from './dto/response/read-meeting-answer.response'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'
import { TimeslotDto } from './dto/basic/timeslot.dto'
import { RatedTimeslotDto } from './dto/basic/rated-timeslot.dto'
import { CalculateMeetingPlanResponse } from './dto/response/calculate-meeting-plan.response'
import { TotalRatedTimeslotDto } from './dto/basic/total-rated-timeslot.dto'
import { NamedRatedTimeslotDto } from './dto/basic/named-rated-timeslot.dto'
import { UpdateMeetingPlanRequest } from './dto/request/update-meeting-plan.request'
import { MeetingAnswerDto } from './dto/basic/meeting-answer.dto'
import { MeetingAnswerRatingDto } from './dto/basic/meeting-answer-rating.dto'

@Injectable()
export class PlanMeetingService {

  constructor(private prismaService: PrismaService) { }

  async checkMeetingPlanUser(userId: number, planUuid: string): Promise<void> {
    let check = await this.prismaService.meetingPlan.findFirst({
      where: {
        uuid: planUuid,
        userId: userId,
      }
    })
    if (!check) {
      throw new NotFoundException('Could not find meeting plan with given UUID for given user ID')
    }
  }

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

  async readMeetingPlan(userId: number, planUuid: string): Promise<ReadMeetingPlanResponse> {
    this.checkMeetingPlanUser(userId, planUuid)
    let findMeetingPlan = await this.prismaService.meetingPlan.findFirst({
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
    if (!findMeetingPlan) {
      throw new NotFoundException('Could not find meeting plan with given UUID')
    }
    return findMeetingPlan
  }

  async updateMeetingPlan(userId: number, planUuid: string, request: UpdateMeetingPlanRequest): Promise<void> {
    await this.checkMeetingPlanUser(userId, planUuid)
    let updateMeetingPlan = await this.prismaService.meetingPlan.update({
      where: {
        uuid: planUuid
      },
      include: {
        blockedTimeslots: true,
      },
      data: {
        planName: request.planName,
        weekCount: request.weekCount,
        timeslotLengthMinutes: request.timeslotLengthMinutes,
        timeslotStartTimeMinutes: request.timeslotStartTimeMinutes,
        ratingRange: request.ratingRange,
        blockedTimeslots: {
          deleteMany: {},
          create: request.blockedTimeslots,
        }
      },
    })
    if (!updateMeetingPlan) {
      throw new InternalServerErrorException('Could not publish meeting plan with this UUID')
    }
  }

  async publishMeetingPlan(userId: number, planUuid: string): Promise<void> {
    await this.checkMeetingPlanUser(userId, planUuid)
    let publishMeetingPlan = await this.prismaService.meetingPlan.update({
      where: {
        uuid: planUuid
      },
      data: {
        receivingAnswers: true,
      },
    })
    if (!publishMeetingPlan) {
      throw new InternalServerErrorException('Could not publish meeting plan with given UUID')
    }
  }

  async readMeetingAnswer(planUuid: string): Promise<ReadMeetingAnswerResponse> {
    let findMeetingPlan = await this.prismaService.meetingPlan.findFirst({
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
    if (!findMeetingPlan) {
      throw new NotFoundException('Could not find meeting plan to answer')
    }
    if (!findMeetingPlan.receivingAnswers) {
      throw new UnauthorizedException('Plan with given UUID not receiving answers at the moment')
    }
    return findMeetingPlan
  }

  async createMeetingAnswer(planUuid: string, request: CreateMeetingAnswerRequest): Promise<void> {
    let findMeetingPlan = await this.prismaService.meetingPlan.findUnique({
      where: {
        uuid: planUuid
      }
    })
    if (!findMeetingPlan) {
      throw new UnauthorizedException('Plan with given UUID does not exist')
    }
    if (!findMeetingPlan.receivingAnswers) {
      throw new UnauthorizedException('Plan with given UUID not receiving answers at the moment')
    }
    let requestInstance = new CreateMeetingAnswerRequest(request.participantName, request.ratedTimeslots)
    await requestInstance.validate(planUuid, this.prismaService)
    let createMeetingPlan = await this.prismaService.meetingPlanAnswer.create({
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
    if (!createMeetingPlan) {
      throw new InternalServerErrorException('Could not create answer to meeting plan')
    }
  }



  async calculateMeetingPlan(userId: number, planUuid: string): Promise<CalculateMeetingPlanResponse> {

    let meetingPlan = await this.prismaService.meetingPlan.findFirst({
      where: {
        uuid: planUuid,
        userId: userId
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

      for (let dayNum = 1, sBI = 0; dayNum < dayCount + 1; dayNum++) {
        for (let timeslotNum = 1; timeslotNum < timeslotsInDayCount + 1; timeslotNum++) {

          let newTotalRated = {
            dayNum: dayNum,
            timeslotNum: timeslotNum,
            rating: meetingPlan.answers.length * meetingPlan.ratingRange,
            lowerThanMaxRatings: []
          }

          if (
            sBI < sortedBlocked.length &&
            TimeslotDto.compare(sortedBlocked[sBI], newTotalRated) == 0
          ) {
            sBI++
            continue
          }

          totalRated.push(newTotalRated)

        }
      }

      // TODO: OPTIMIZE

      meetingPlan.answers.forEach((answer) => {
        let sAnswerRated = answer.ratedTimeslots.sort(TimeslotDto.compare)

        for (let tI = 0, sAI = 0; tI < totalRated.length && sAI < sAnswerRated.length; tI++) {
          while (TimeslotDto.compare(totalRated[tI], sAnswerRated[sAI]) == 0) {
            totalRated[tI].rating += sAnswerRated[sAI].rating - meetingPlan.ratingRange

            if (sAnswerRated[sAI].rating < meetingPlan.ratingRange) {
              totalRated[tI].lowerThanMaxRatings.push(
                new MeetingAnswerRatingDto(answer, sAnswerRated[sAI].rating)
              )
            }

            sAI++

            if (sAI >= sAnswerRated.length) {
              break
            }
          }
        }
      })

      let sTotalRated = totalRated.sort(RatedTimeslotDto.compareRating).reverse()

      return { sortedTotalRatedTimeslots: sTotalRated }
    }

    throw new NotFoundException('Couldn not find meeting plan to calculate')

  }

  async deleteMeetingPlan(planUuid: string): Promise<void> {
    await this.prismaService.meetingPlan.delete({ where: { uuid: planUuid } })
  }

}
