import { Controller, Get, Render, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AtGuard } from '../base-auth/guards'
import { GetCurrentUserId } from '../base-auth/decorators'
import { UserHomeService } from './user-home.service'
import { ReadUserResponse } from './dto/response/read-user.response'
import { UserMeetingPlan } from './dto/basic/user-meeting-plan.dto'


@Controller('/view/user/home')
@ApiTags('user-home')
export class UserHomeViewController {
  constructor(private userHomeService: UserHomeService) { }

  @ApiOperation({
    summary: 'Get user home page'
  })
  @ApiResponse({
    status: 200,
    description: 'User home page successfully rendered and received.'
  })
  @ApiBearerAuth()
  //@UseGuards(AtGuard)
  @Render('user_home')
  @Get()
  async readUser(userId: number = 2): Promise<ReadUserResponse> {
    console.log(userId)
    return this.userHomeService.readUser(userId)
  }

}