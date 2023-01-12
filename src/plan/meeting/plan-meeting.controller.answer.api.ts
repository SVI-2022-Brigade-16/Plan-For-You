import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { PlanMeetingService } from './plan-meeting.service'

import { GetCurrentUserId } from '../../auth/decorators'
import { CreateMeetingAnswer } from './dto/methods/create-meeting-answer'
import { ReadMeetingAnswerForm } from './dto/methods/read-meeting-answer-form'
import { MeetingAnswerWithRatings } from './dto/objects/meeting-answer-with-ratings.dto'

@ApiTags('plan-meeting')
@Controller('api/plan/meeting')
export class PlanMeetingAnswerApiController {

  constructor(private service: PlanMeetingService) { }

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
  async createAnswer(
    @Param('planUuid') planUuid: string,
    @Body() request: CreateMeetingAnswer.Request
  ): Promise<void> {
    await this.service.createAnswer(planUuid, request)
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
  async readAnswer(
    @Param('planUuid') planUuid: string,
    @Param('answerId') answerId: number
  ): Promise<MeetingAnswerWithRatings> {
    return await this.service.readAnswer(planUuid, answerId)
  }

  @ApiOperation({
    summary: 'Delete meeting plan participant answer'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan answer successfully deleted.'
  })
  @ApiCookieAuth()
  @Delete(':planUuid/answer/:answerId')
  async deleteAnswer(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string,
    @Param('answerId') answerId: number
  ): Promise<void> {
    await this.service.deleteAnswer(userId, planUuid, answerId)
  }

  @ApiOperation({
    summary: 'Read meeting plan form for participant answer'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan form successfully received.'
  })
  @Get(':planUuid/answer/form')
  async readAnswerForm(
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingAnswerForm.Response> {
    return await this.service.readAnswerForm(planUuid)
  }
}
