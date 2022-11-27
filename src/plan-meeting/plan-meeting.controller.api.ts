import { Body, Controller, Delete, Get, Param, Post, Put, Render, UseGuards } from '@nestjs/common'
import { CreateMeetingPlanRequest } from './dto/request/create-meeting-plan.request'
import { CreateMeetingPlanResponse } from './dto/response/create-meeting-plan.response'
import { PlanMeetingService } from './plan-meeting.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateMeetingAnswerRequest } from './dto/request/create-meeting-answer.request'
import { CalculateMeetingPlanResponse } from './dto/response/calculate-meeting-plan.response'
import { UpdateMeetingPlanRequest } from './dto/request/update-meeting-plan.request'
import { AtGuard } from '../base-auth/guards'
import { GetCurrentUserId } from '../base-auth/decorators'
import { ReadMeetingAnswerConditionsResponse } from './dto/response/read-meeting-answer-conditions.response'

@Controller('/api/plan/meeting')
@ApiTags('plan-meeting')
export class PlanMeetingApiController {

  constructor(
    private planMeetingService: PlanMeetingService
  ) { }

  @ApiOperation({
    summary: 'Create meeting plan'
  })
  @ApiBody({
    type: CreateMeetingPlanRequest,
    description: 'Settings needed to create a meeting plan',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully created.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Post()
  async createMeetingPlan(@GetCurrentUserId() userId: number, @Body() request: CreateMeetingPlanRequest): Promise<CreateMeetingPlanResponse> {
    return await this.planMeetingService.createMeetingPlan(userId, request)
  }

  @ApiOperation({
    summary: 'Read meeting plan state'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan with given UUID successfully received.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Get(':planUuid')
  async readMeetingPlan(@GetCurrentUserId() userId: number, @Param('planUuid') planUuid: string): Promise<ReadMeetingPlanResponse> {
    return await this.planMeetingService.readMeetingPlan(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Update meeting plan with new settings'
  })
  @ApiBody({
    type: UpdateMeetingPlanRequest,
    description: 'Settings to be updated',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully updated.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Put(':planUuid/update')
  async updateMeetingPlan(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string,
    @Body() request: UpdateMeetingPlanRequest
  ): Promise<void> {
    await this.planMeetingService.updateMeetingPlan(userId, planUuid, request)
  }

  @ApiOperation({
    summary: 'Delete meeting plan'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully deleted.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Delete(':planUuid')
  async deleteMeetingPlan(@GetCurrentUserId() userId: number, @Param('planUuid') planUuid: string): Promise<void> {
    await this.planMeetingService.deleteMeetingPlan(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Publish meeting plan to receive answers'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully published.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Post(':planUuid/publish')
  async publishMeetingPlan(@GetCurrentUserId() userId: number, @Param('planUuid') planUuid: string): Promise<void> {
    await this.planMeetingService.publishMeetingPlan(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Read meeting plan conditions for participant answer'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan conditions successfully received.'
  })
  @Get(':planUuid/answer/conditions')
  async readMeetingAnswerConditions(@Param('planUuid') planUuid: string): Promise<ReadMeetingAnswerConditionsResponse> {
    return await this.planMeetingService.readMeetingAnswerConditions(planUuid)
  }

  @ApiOperation({
    summary: 'Send meeting plan participant answer'
  })
  @ApiBody({
    type: CreateMeetingAnswerRequest,
    description: 'Answer information with rated timeslots',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully updated.'
  })
  @Post(':planUuid/answer')
  async createMeetingAnswer(
    @Param('planUuid') planUuid: string,
    @Body() request: CreateMeetingAnswerRequest
  ): Promise<void> {
    await this.planMeetingService.createMeetingAnswer(planUuid, request)
  }

  @ApiOperation({
    summary: 'Calculate total best meeting plan timeslots using answers'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan has been calculated successfully.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Get(':planUuid/calculate')
  async calculateMeetingPlan(@GetCurrentUserId() userId: number, @Param('planUuid') planUuid: string)
    : Promise<CalculateMeetingPlanResponse> {
    return await this.planMeetingService.calculateMeetingPlan(userId, planUuid)
  }

}
