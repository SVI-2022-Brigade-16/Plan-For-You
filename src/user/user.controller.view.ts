import { Controller, Get, Render, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCurrentUserId } from '../auth/decorators'
import { AtGuard } from '../auth/guards'
import { ReadUserResponse } from './dto/response/read-user.response'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('view/user')
export class UserViewController {

  constructor(private service: UserService) { }

  @ApiOperation({
    summary: 'Get user home page'
  })
  @ApiResponse({
    status: 200,
    description: 'User home page successfully rendered and received.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Render('user_home')
  @Get('home')
  async getUserHomePage(@GetCurrentUserId() userId: number): Promise<ReadUserResponse> {
    return this.service.readUser(userId)
  }

}