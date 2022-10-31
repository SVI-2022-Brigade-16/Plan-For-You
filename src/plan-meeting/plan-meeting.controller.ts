import { Body, Controller, Delete, Get, Param, Post, Render } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { PlanMeetingService } from './plan-meeting.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { PublishMeetingPlanRequest } from './dto/request/publish-meeting-plan.request'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ReadMeetingAnswerResponse } from './dto/response/read-meeting-answer.response'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'
import { CalculateMeetingPlanResponse } from './dto/response/calculate-meeting-plan.response'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/plan/meeting')
@ApiTags('plan-meeting')
export class PlanMeetingController {

  constructor(
    private planMeetingService: PlanMeetingService
  ) { }

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
  async createMeetingPlan(userId: number, @Body() request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {
    userId = 1
    return await this.planMeetingService.createMeetingPlan(userId, request)
  }

  @ApiOperation({
    summary: 'Get meeting plan to database'
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully downloaded.'
  })
  @Get(":planUuid")
  async readMeetingPlan(@Param('planUuid') planUuid: string): Promise<ReadMeetingPlanResponse> {
    return await this.planMeetingService.readMeetingPlan(planUuid)
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
  async createMeetingAnswer(
    @Param('planUuid') planUuid: string,
    @Body() request: CreateMeetingAnswerRequest
  ): Promise<void> {
    await this.planMeetingService.createMeetingAnswer(planUuid, request)
  }

  @ApiOperation({
    summary: 'Calculate best timeslots in meeting plan using answers'
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been calculated successfully.'
  })
  @Get(":planUuid/calculate")
  async calculateMeetingPlan(@Param('planUuid') planUuid: string): Promise<CalculateMeetingPlanResponse> {
    return await this.planMeetingService.calculateMeetingPlan(planUuid)
  }


  @ApiOperation({
    summary: 'Delete meeting plan from database'
  })
  @ApiResponse({
    status: 200,
    description: 'The meeting plan has been successfully deleted.'
  })
  @Delete(":planUuid")
  async removeMeetingPlan(@Param('planUuid') planUuid: string) {
    return await this.planMeetingService.removeMeetingPlan(planUuid)
  }


}
