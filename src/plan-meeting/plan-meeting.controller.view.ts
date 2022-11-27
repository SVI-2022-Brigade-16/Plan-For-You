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

@Controller('/view/plan/meeting')
@ApiTags('plan-meeting')
export class PlanMeetingViewController {

  constructor(private planMeetingService: PlanMeetingService) { }

  @ApiOperation({
    summary: 'Get meeting plan organizer page'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan organizer page successfully rendered and received.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Render('meeting-plan-organizer')
  @Get(':planUuid')
  async getOrganizerPage(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingPlanResponse> {
    return await this.planMeetingService.readMeetingPlan(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Get meeting plan answerer page'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan answerer page successfully rendered and received.'
  })
  @Render('meeting-plan-answerer')
  @Get(':planUuid/answer')
  async getAnswererPage(
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingAnswerConditionsResponse> {
    return await this.planMeetingService.readMeetingAnswerConditions(planUuid)
  }

}
