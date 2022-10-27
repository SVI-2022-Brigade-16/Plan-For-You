import { Controller, Post } from '@nestjs/common'
import { CreatePlanMeetingRequest } from './request/create-plan-meeting.request'
import { CreatePlanMeetingResponse } from './response/create-meeting-plan.response'
import { PlanMeetingService } from './plan-meeting.service'


@Controller('plan-meeting')
export class PlanMeetingController {

  constructor(private planMeetingService: PlanMeetingService) { }

  @Post()
  async createPlanMeeting(createPlanMeetingRequest: CreatePlanMeetingRequest): Promise<CreatePlanMeetingResponse> {
    return this.planMeetingService.createPlanMeeting(createPlanMeetingRequest)
  }

}
