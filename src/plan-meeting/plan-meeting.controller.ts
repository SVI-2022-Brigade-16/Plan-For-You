import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { PlanMeetingService } from './plan-meeting.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { PublishMeetingPlanRequest } from './dto/request/publish-meeting-plan.request'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { ReadMeetingAnswerResponse } from './dto/response/read-meeting-answer.response'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'

@Controller('/plan/meeting')
export class PlanMeetingController {

  constructor(private planMeetingService: PlanMeetingService) { }

  @ApiOperation({
    summary: 'Post meeting plan to database'
  })
  @ApiBody({
    type: CreateMeetingPlanRequest,
    description: 'Basic meeting plan info',
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully uploaded.'
  })
  @Post()
  async createPlanMeeting(userId: number, @Body() request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {
    userId = 1
    return await this.planMeetingService.createPlanMeeting(userId, request)
  }

  @ApiOperation({
    summary: 'Get meeting plan to database'
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully downloaded.'
  })
  @Get(":planUuid")
  async readPlanMeeting(@Param('planUuid') planUuid: string): Promise<ReadMeetingPlanResponse> {
    return await this.planMeetingService.readPlanMeeting(planUuid)
  }

  @ApiOperation({
    summary: 'Publish meeting plan to receive answers'
  })
  @ApiBody({
    type: PublishMeetingPlanRequest,
    description: 'Basic meeting plan info',
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully published.'
  })
  @Post(":planUuid/publish")
  async publishMeetingPlan(@Param('planUuid') planUuid: string, @Body() request: PublishMeetingPlanRequest): Promise<void> {
    await this.planMeetingService.publishMeetingPlan(planUuid, request)
  }

  @ApiOperation({
    summary: 'Download meeting plan participant answer page info'
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully downloaded.'
  })
  @Get(":planUuid/answer")
  async readMeetingAnswer(@Param('planUuid') planUuid: string): Promise<ReadMeetingAnswerResponse> {
    return await this.planMeetingService.readMeetingAnswer(planUuid)
  }

  @ApiOperation({
    summary: 'Post meeting plan answer'
  })
  @ApiBody({
    type: CreateMeetingAnswerRequest,
    description: 'Basic meeting plan info',
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully updated.'
  })
  @Post(":planUuid/answer")
  async createMeetingAnswer(@Param('planUuid') planUuid: string, @Body() request: CreateMeetingAnswerRequest): Promise<void> {
    await this.planMeetingService.createMeetingAnswer(planUuid, request)
  }

}
