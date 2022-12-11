import { Controller, Get, Param, Render, UseGuards } from '@nestjs/common'
import { PlanMeetingService } from './plan-meeting.service'
import { ReadMeetingPlanResponse } from './dto/response/read-meeting-plan.response'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AtGuard } from '../base-auth/guards'
import { GetCurrentUserId } from '../base-auth/decorators'
import { ReadMeetingAnswerConditionsResponse } from './dto/response/read-meeting-answer-conditions.response'


@ApiTags('plan-meeting')
@Controller('view/plan/meeting')
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
  //@UseGuards(AtGuard)
  @Render('plan_meeting_organizer')
  @Get(':planUuid')
  async getOrganizerPage(
    //@GetCurrentUserId() 
    userId: number = 2,
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
  @Render('plan_meeting_answer')
  @Get(':planUuid/answer')

  async getAnswererPage(
    userId: number = 2,
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingAnswerConditionsResponse> {
    return await this.planMeetingService.readMeetingAnswerConditions(planUuid)
  }

}
