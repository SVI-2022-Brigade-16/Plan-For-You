import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCurrentUserId } from '../user-auth/decorators'
import { AtGuard } from '../user-auth/guards'
import { ReadUserResponse } from './dto/response/read-user.response'
import { UserHomeService } from './user-home.service'

@ApiTags('user-home')
@Controller('user-home')
export class UserHomeController {

  constructor(
    private userHomeService: UserHomeService
  ) { }

  @ApiOperation({
    summary: 'Read user information'
  })
  @ApiResponse({
    status: 200,
    description: 'User information successfully received.'
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Get()
  async readUser(@GetCurrentUserId() userId: number): Promise<ReadUserResponse> {
    return this.userHomeService.readUser(userId)
  }

}
