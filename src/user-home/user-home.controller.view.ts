import { Body, Controller, Delete, Get, Param, Post, Put, Render, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

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
  //@Get(':planUuid')
  @Get()
  async readUser(): Promise<ReadUserResponse> {
    return this.userHomeService.readUser(3)
  }

}
