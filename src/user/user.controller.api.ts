import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCurrentUserId } from '../auth/decorators'
import { AtGuard } from '../auth/guards'
import { ReadUserResponse } from './dto/response/read-user.response'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('api/user')
export class UserApiController {

  constructor(private service: UserService) { }

  @ApiOperation({
    summary: 'Get user information'
  })
  @ApiResponse({
    status: 200,
    description: 'User home information successfully received.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Get('home')
  async getUserHome(@GetCurrentUserId() userId: number): Promise<ReadUserResponse> {
    return this.service.readUser(userId)
  }

}
