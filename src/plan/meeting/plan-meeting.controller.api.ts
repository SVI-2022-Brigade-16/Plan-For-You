import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { PlanMeetingService } from './plan-meeting.service'

import { GetCurrentUserId } from '../../auth/decorators'
import { AtGuard } from '../../auth/guards'

import { ReadMeetingPlanResult } from './dto/methods/read-meeting-plan-result'
import { CreateMeetingAnswer } from './dto/methods/create-meeting-answer'
import { CreateMeetingPlan } from './dto/methods/create-meeting-plan'
import { ReadMeetingAnswerForm } from './dto/methods/read-meeting-answer-form'
import { ReadMeetingPlan } from './dto/methods/read-meeting-plan'
import { UpdateMeetingPlan } from './dto/methods/update-meeting-plan'
import { MeetingAnswerWithRatings } from './dto/objects/meeting-answer-with-ratings.dto'

@ApiTags('plan-meeting')
@Controller('api/plan/meeting')
export class PlanMeetingApiController {

  constructor(private planMeetingService: PlanMeetingService) { }

  @ApiOperation({
    summary: 'Create meeting plan'
  })
  @ApiBody({
    type: CreateMeetingPlan.Request,
    description: 'Settings needed to create a meeting plan',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully created.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Post()
  async createMeetingPlan(
    @GetCurrentUserId() userId: number,
    @Body() request: CreateMeetingPlan.Request
  ): Promise<CreateMeetingPlan.Response> {
    return await this.planMeetingService.createPlan(userId, request)
  }

  @ApiOperation({
    summary: 'Read meeting plan state'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan with given UUID successfully received.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Get(':planUuid')
  async readMeetingPlan(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingPlan.Response> {
    return await this.planMeetingService.readPlan(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Update meeting plan with new settings'
  })
  @ApiBody({
    type: UpdateMeetingPlan.Request,
    description: 'Settings to be updated',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully updated.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Put(':planUuid/update')
  async updateMeetingPlan(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string,
    @Body() request: UpdateMeetingPlan.Request
  ): Promise<void> {
    await this.planMeetingService.updatePlan(userId, planUuid, request)
  }

  @ApiOperation({
    summary: 'Delete meeting plan'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully deleted.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Delete(':planUuid')
  async deleteMeetingPlan(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string
  ): Promise<void> {
    await this.planMeetingService.deletePlan(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Publish meeting plan to receive answers'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan successfully published.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Post(':planUuid/publish/:state')
  async publishMeetingPlan(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string,
    @Param('state') state: boolean
  ): Promise<void> {
    await this.planMeetingService.updatePublishing(userId, planUuid, state)
  }

  @ApiOperation({
    summary: 'Read meeting plan answer conditions'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan form successfully received.'
  })
  @UseGuards(AtGuard)
  @Get(':planUuid/answer/conditions')
  async readMeetingAnswerConditions(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingAnswerForm.Response> {
    return await this.planMeetingService.readAnswerConditions(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Read meeting plan form for participant answer'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan form successfully received.'
  })
  @Get(':planUuid/answer/form')
  async readMeetingAnswerForm(
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingAnswerForm.Response> {
    return await this.planMeetingService.readAnswerForm(planUuid)
  }

  @ApiOperation({
    summary: 'Read meeting plan participant answer'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan answer successfully received.'
  })
  @ApiCookieAuth()
  @Get(':planUuid/answer/:answerId')
  async readMeetingAnswer(
    @Param('planUuid') planUuid: string,
    @Param('answerId') answerId: number
  ): Promise<MeetingAnswerWithRatings> {
    return await this.planMeetingService.readAnswer(planUuid, answerId)
  }

  @ApiOperation({
    summary: 'Send meeting plan participant answer'
  })
  @ApiBody({
    type: CreateMeetingAnswer.Request,
    description: 'Answer information with rated timeslots',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan answer successfully sent.'
  })
  @Post(':planUuid/answer')
  async createMeetingAnswer(
    @Param('planUuid') planUuid: string,
    @Body() request: CreateMeetingAnswer.Request
  ): Promise<void> {
    await this.planMeetingService.createAnswer(planUuid, request)
  }

  @ApiOperation({
    summary: 'Calculate total best meeting plan timeslots using answers'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan has been calculated successfully.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Get(':planUuid/result')
  async readMeetingPlanResult(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingPlanResult.Response> {
    return await this.planMeetingService.readResult(userId, planUuid)
  }

}
