import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'
import { Timeslot } from './dto/basic/timeslot.dto'
import { RatedTimeslot } from './dto/basic/rated-timeslot.dto'
import { CalculateMeetingPlanResponse } from './dto/response/calculate-meeting-plan.response'
import { TotalRatedTimeslot } from './dto/basic/total-rated-timeslot.dto'
import { UpdateMeetingPlanRequest } from './dto/request/update-meeting-plan.request'
import { MeetingAnswerRating } from './dto/basic/meeting-answer-rating.dto'
import { MeetingAnswerConditions } from './dto/basic/meeting-answer-conditions.dto'
import { PlanMeetingPrisma } from './plan-meeting.prisma'
import { MeetingPlanWithAnswerRatings } from './dto/basic/meeting-plan-with-rating.dto'

@Injectable()
export class PlanMeetingService {

  constructor(private prisma: PlanMeetingPrisma) { }

  /* Interface implementation */

  async createMeetingPlan(userId: number, request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {
    const receivingAnswers = false
    const plan = await this.prisma.createMeetingPlan(userId, request, receivingAnswers)
    return { planUuid: plan.uuid }
  }

  async readMeetingPlan(userId: number, planUuid: string): Promise<ReadMeetingPlanResponse> {
    let plan = await this.prisma.readMeetingPlanNoAnswerRatings(planUuid)
    if (plan.user.id != userId) {
      this.throwPlanNotFoundForUser(userId, planUuid)
    }
    return plan
  }

  async updateMeetingPlan(userId: number, planUuid: string, request: UpdateMeetingPlanRequest): Promise<void> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    await this.prisma.updateMeetingPlan(planUuid, request)
  }

  async deleteMeetingPlan(userId: number, planUuid: string): Promise<void> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    await this.prisma.deleteMeetingPlan(planUuid)
  }

  async publishMeetingPlan(userId: number, planUuid: string): Promise<void> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    await this.prisma.publishMeetingPlan(planUuid)
  }

  async readMeetingAnswerConditions(planUuid: string): Promise<MeetingAnswerConditions> {
    let conditions = await this.checkPlanReceivingAnswers(planUuid)
    return conditions
  }

  async createMeetingAnswer(planUuid: string, request: CreateMeetingAnswerRequest): Promise<void> {
    await this.checkPlanReceivingAnswers(planUuid)
    await this.prisma.createMeetingAnswer(planUuid, request)
  }

  async calculateMeetingPlan(userId: number, planUuid: string): Promise<CalculateMeetingPlanResponse> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    let plan = await this.prisma.readMeetingPlanWithAnswerRatings(planUuid)

    let totalTimeslotMap = this.prepareTotalTimeslotMap(plan)
    this.deleteTimeslots(totalTimeslotMap, plan.blockedTimeslots)
    this.reduceTotalRatingsByAnswerRatings(plan, totalTimeslotMap)

    let totalTimeslots: TotalRatedTimeslot[] = []
    for (let timeslot of totalTimeslotMap.values()) {
      totalTimeslots.push(timeslot)
    }
    let sTotalTimeslots = totalTimeslots.sort(RatedTimeslot.compareRating).reverse()

    return new CalculateMeetingPlanResponse(plan, sTotalTimeslots)
  }

  /* Helper functions */

  prepareTotalTimeslotMap(plan: MeetingPlanWithAnswerRatings): Map<string, TotalRatedTimeslot> {

    let totalTimeslotMap = new Map<string, TotalRatedTimeslot>()

    const timeslotsInDayCount = (1440 - plan.timeslotStartTimeMinutes) / plan.timeslotLengthMinutes
    const dayCount = plan.weekCount * 7
    const totalRatingMax = plan.answers.length * plan.ratingMax

    for (let dayNum = 0; dayNum < dayCount; dayNum++) {
      for (let timeslotNum = 0; timeslotNum < timeslotsInDayCount; timeslotNum++) {
        const newTimeslot = {
          dayNum: dayNum,
          timeslotNum: timeslotNum,
          rating: totalRatingMax,
          lowerThanMaxRatings: []
        }
        totalTimeslotMap.set(Timeslot.makeKey(dayNum, timeslotNum), newTimeslot)
      }
    }
    return totalTimeslotMap
  }

  deleteTimeslots(timeslotMap: Map<string, Timeslot>, blockedTimeslots: Timeslot[]) {
    for (let blockedTimeslot of blockedTimeslots) {
      timeslotMap.delete(Timeslot.makeKeyFromTimeslot(blockedTimeslot))
    }
  }

  reduceTotalRatingsByAnswerRatings(plan: MeetingPlanWithAnswerRatings, totalTimeslotMap: Map<string, TotalRatedTimeslot>) {
    const answers = plan.answers
    const ratingMax = plan.ratingMax

    for (let answer of answers) {
      const answerTimeslots = answer.ratedTimeslots

      for (let answerTimeslot of answerTimeslots) {
        const key = Timeslot.makeKeyFromTimeslot(answerTimeslot)
        const totalTimeslot = totalTimeslotMap.get(key)

        if (totalTimeslot) {
          totalTimeslot.rating -= ratingMax - answerTimeslot.rating
          if (answerTimeslot.rating < ratingMax) {
            totalTimeslot.lowerThanMaxRatings.push(
              new MeetingAnswerRating(answer, answerTimeslot.rating)
            )
          }
        }
      }
    }
  }

  async checkPlanBelongsToUser(userId: number, planUuid: string) {
    const belongsToUser = await this.prisma.planBelongsToUser(userId, planUuid)
    if (!belongsToUser) {
      this.throwPlanNotFoundForUser(userId, planUuid)
    }
  }

  async checkPlanReceivingAnswers(planUuid: string): Promise<MeetingAnswerConditions> {
    let conditions = await this.prisma.readMeetingAnswerConditions(planUuid)
    if (!conditions.receivingAnswers) {
      this.throwNotReceivingAnswers(planUuid)
    }
    return conditions
  }

  throwPlanNotFoundForUser(userId: number, planUuid: string): never {
    throw new NotFoundException('Exception: Meeting plan ' + planUuid + ' not found for user ' + userId)
  }

  throwNotReceivingAnswers(planUuid: string) {
    throw new BadRequestException('Plan ' + planUuid + ' not receiving answers at the moment')
  }

}
