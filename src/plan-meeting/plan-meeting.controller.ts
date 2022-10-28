import { Controller, Get, Post } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './response/create-meeting-plan.response'
import { PlanMeetingService } from './plan-meeting.service'
import { groupEnd } from 'console'

@Controller('/plan/meeting')
export class PlanMeetingController {

  constructor(private planMeetingService: PlanMeetingService) { }

  @Post()
  async createPlanMeeting(userId: number, request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {
    return await this.planMeetingService.createPlanMeeting(userId, request)
  }

}
