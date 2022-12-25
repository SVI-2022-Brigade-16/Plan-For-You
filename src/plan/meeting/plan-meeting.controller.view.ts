import { Controller, Get, Param, Render, UseGuards } from '@nestjs/common'
import { PlanMeetingService } from './plan-meeting.service'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCurrentUserId } from '../../auth/decorators'
import { AtGuard } from '../../auth/guards'
import { ReadMeetingAnswerForm } from './dto/methods/read-meeting-answer-form'
import { ReadMeetingPlan } from './dto/methods/read-meeting-plan'

@ApiTags('plan-meeting')
@Controller('view/plan/meeting')
export class PlanMeetingViewController {

  constructor(private service: PlanMeetingService) { }

  @ApiOperation({
    summary: 'Get meeting plan organizer page'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan organizer page successfully rendered and received.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Render('plan_meeting_organizer')
  @Get(':planUuid')
  async getPlanPage(
    @GetCurrentUserId() userId: number,
    @Param('planUuid') planUuid: string
  ): Promise<ReadMeetingPlan.Response> {
    return await this.service.readPlan(userId, planUuid)
  }

  @ApiOperation({
    summary: 'Get meeting plan answerer page'
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting plan answerer page successfully rendered and received.'
  })
  @Render('plan_meeting_answer')
  @Get(':planUuid/answer/form')
  async getAnswerFormPage(@Param('planUuid') planUuid: string): Promise<ReadMeetingAnswerForm.Response> {
    return await this.service.readAnswerForm(planUuid)
  }

}
