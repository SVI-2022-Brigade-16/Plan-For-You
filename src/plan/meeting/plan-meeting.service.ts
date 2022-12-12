import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { PlanMeetingPrisma } from './plan-meeting.prisma'
import { IPlanMeetingService } from './plan-meeting.service.interface'

import { MeetingAnswerForm } from './dto/objects/meeting-answer-choice.dto'
import { MeetingAnswerRating } from './dto/objects/meeting-answer-rating.dto'
import { MeetingPlanWithAnswerRatings } from './dto/objects/meeting-plan-with-rating.dto'
import { MeetingPlan } from './dto/objects/meeting-plan.dto'
import { RatedTimeslot } from './dto/objects/rated-timeslot.dto'
import { Timeslot } from './dto/objects/timeslot.dto'
import { TotalRatedTimeslot } from './dto/objects/total-rated-timeslot.dto'

import { CreateMeetingPlan } from './dto/methods/create-meeting-plan'
import { CreateMeetingAnswer } from './dto/methods/create-meeting-answer'
import { ReadMeetingAnswer } from './dto/methods/read-meeting-answer'
import { ReadMeetingAnswerForm } from './dto/methods/read-meeting-answer-form'
import { ReadMeetingPlan } from './dto/methods/read-meeting-plan'
import { ReadMeetingPlanResult } from './dto/methods/read-meeting-plan-result'
import { UpdateMeetingPlan } from './dto/methods/update-meeting-plan'

@Injectable()
export class PlanMeetingService implements IPlanMeetingService {

  /* Interface implementation */

  constructor(private prisma: PlanMeetingPrisma) { }

  // Create new meeting plan
  async createPlan(userId: number, request: CreateMeetingPlan.Request): Promise<CreateMeetingPlan.Response> {
    const receivingAnswers = false

    if (!request.planName) {
      request = new MeetingPlan()
    }

    const plan = await this.prisma.createMeetingPlan(userId, request, receivingAnswers)
    return { planUuid: plan.uuid }
  }

  // Read information about a meeting plan
  async readPlan(userId: number, planUuid: string): Promise<ReadMeetingPlan.Response> {
    let plan = await this.prisma.readMeetingPlanNoAnswerRatings(planUuid)
    if (plan.user.id != userId) {
      this.throwPlanNotFoundForUser(userId, planUuid)
    }
    return plan
  }

  // Update information for a meeting plan
  async updatePlan(userId: number, planUuid: string, request: UpdateMeetingPlan.Request): Promise<void> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    await this.prisma.updateMeetingPlan(planUuid, request)
  }

  // Delete meeting plan
  async deletePlan(userId: number, planUuid: string): Promise<void> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    await this.prisma.deleteMeetingPlan(planUuid)
  }

  // Make meeting plan start or stop receiving answers
  async updatePublishing(userId: number, planUuid: string, state: boolean): Promise<void> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    await this.prisma.publishMeetingPlan(planUuid, state)
  }

  // Read meeting plan answer conditions
  async readAnswerConditions(userId: number, planUuid: string): Promise<ReadMeetingAnswerForm.Response> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    let conditions = await this.getConditionsThrowIfNotReceiving(planUuid)
    return conditions
  }

  // Read meeting plan answer form
  async readAnswerForm(planUuid: string): Promise<ReadMeetingAnswerForm.Response> {
    let form = await this.getConditionsThrowIfNotReceiving(planUuid)
    return form
  }

  // Read meeting plan answer
  async readAnswer(planUuid: string, answerId: number): Promise<ReadMeetingAnswer.Response> {
    let result = await this.prisma.readAnswer(planUuid, answerId)
    return result
  }

  // Create and attach new answer to a meeting plan
  async createAnswer(planUuid: string, request: CreateMeetingAnswer.Request): Promise<void> {
    await this.getConditionsThrowIfNotReceiving(planUuid)
    await this.prisma.createMeetingAnswer(planUuid, request)
  }

  // Calculate and read all the total timeslot ratings based on all the participant answers
  async readResult(userId: number, planUuid: string): Promise<ReadMeetingPlanResult.Response> {
    await this.checkPlanBelongsToUser(userId, planUuid)
    let plan = await this.prisma.readPlanWithAnswerRatings(planUuid)

    let totalTimeslotMap = this.prepareTotalTimeslotMap(plan)
    this.deleteFromMap(totalTimeslotMap, plan.blockedTimeslots)
    this.reduceTotalRatingsByAnswerRatings(plan, totalTimeslotMap)

    let totalTimeslots: TotalRatedTimeslot[] = []
    for (let timeslot of totalTimeslotMap.values()) {
      totalTimeslots.push(timeslot)
    }
    let sTotalTimeslots = totalTimeslots.sort(RatedTimeslot.compareRating).reverse()

    return new ReadMeetingPlanResult.Response(plan, sTotalTimeslots)
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

  deleteFromMap(timeslotMap: Map<string, Timeslot>, timeslots: Timeslot[]) {
    for (let timeslot of timeslots) {
      timeslotMap.delete(Timeslot.makeKeyFromTimeslot(timeslot))
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

  async getConditionsThrowIfNotReceiving(planUuid: string): Promise<MeetingAnswerForm> {
    let conditions = await this.prisma.readMeetingAnswerForm(planUuid)
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
