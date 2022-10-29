import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './response/create-meeting-plan.response'
import { PlanMeetingService } from './plan-meeting.service'
import { ReadMeetingPlanResponse } from './response/read-meeting-plan.response'
import { PublishMeetingPlanRequest } from './request/publish-meeting-plan.request'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

@Controller('/plan/meeting')
export class PlanMeetingController {

  constructor(private planMeetingService: PlanMeetingService) { }

  @ApiOperation({
    summary: 'Post meeting plan to database'
  })
  @ApiParam({ name: 'userId', type: 'numeric' })
  @ApiBody({
    type: CreateMeetingPlanRequest,
    description: 'Basic meeting plan info',
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully uploaded.'
  })
  // @ApiResponse({
  //   status: 404,
  //   description: 'The product page was not found.'
  // })
  @Post()
  //@Render('product')
  async createPlanMeeting(@Param() userId: number, @Body() request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {
    return await this.planMeetingService.createPlanMeeting(userId, request)
  }

  @ApiOperation({
    summary: 'Get meeting plan to database'
  })
  @ApiParam({ name: 'planUuid', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully downloaded.'
  })
  @Get(":planUuid")
  async readPlanMeeting(@Param("planUuid") planUuid: string): Promise<ReadMeetingPlanResponse> {
    return await this.planMeetingService.readPlanMeeting(planUuid)
  }

  @ApiBody({
    type: PublishMeetingPlanRequest,
    description: 'Basic meeting plan info',
  })
  @Post(":planUuid")
  async publishMeetingPlan(@Param("planUuid") planUuid: string, @Body() request: PublishMeetingPlanRequest): Promise<void> {
    await this.planMeetingService.publishMeetingPlan(planUuid, request)
  }


}

