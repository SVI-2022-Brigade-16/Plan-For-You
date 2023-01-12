import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Tokens } from './types'
import { AtGuard, RtGuard } from './guards'
import { GetCurrentUser, GetCurrentUserId } from './decorators'
import { ApiCookieAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SignUpRequest } from './dto/request/sign-up.request'
import { SignInRequest } from './dto/request/sign-in.request'
import { Response } from 'express'

@ApiTags('base-auth')
@Controller('auth')
export class AuthApiController {
  constructor(private authService: AuthService) { }

  @ApiOperation({
    summary: 'Sign up user'
  })
  @ApiBody({
    type: SignUpRequest,
    description: 'Sign up information',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully registered.'
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() request: SignUpRequest, @Res() res: Response): Promise<void> {
    let tokens = await this.authService.signup(request)
    res.cookie('planForYouAccessToken', tokens.access_token, {
      expires: new Date(new Date().getTime() + parseInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS!) * 1000),
      sameSite: 'strict',
      httpOnly: true,
    })
    res.cookie('planForYouRefreshToken', tokens.refresh_token, {
      expires: new Date(new Date().getTime() + parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS!) * 1000),
      sameSite: 'strict',
      httpOnly: true,
    })
    res.send()
  }

  @ApiOperation({
    summary: 'Sign in user'
  })
  @ApiBody({
    type: SignInRequest,
    description: 'Sign in information',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in.'
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() request: SignInRequest, @Res() res: Response): Promise<void> {
    let tokens = await this.authService.signin(request)
    res.cookie('planForYouAccessToken', tokens.access_token, {
      expires: new Date(new Date().getTime() + parseInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS!) * 1000),
      sameSite: 'strict',
      httpOnly: true,
    })
    res.cookie('planForYouRefreshToken', tokens.refresh_token, {
      expires: new Date(new Date().getTime() + parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS!) * 1000),
      sameSite: 'strict',
      httpOnly: true,
    })
    res.send()
  }

  @ApiOperation({
    summary: 'Sign out user'
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed out.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@GetCurrentUserId() userId: number): Promise<void> {
    return await this.authService.signout(userId)
  }

  @ApiOperation({
    summary: 'Refresh user access token'
  })
  @ApiResponse({
    status: 200,
    description: 'User access token successfully refreshed.'
  })
  @ApiCookieAuth()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res() res: Response
  ): Promise<void> {
    let tokens = await this.authService.refreshTokens(userId, refreshToken)
    res.cookie('planForYouAccessToken', tokens.access_token, {
      expires: new Date(new Date().getTime() + parseInt(process.env.ACCESS_TOKEN_EXPIRATION_SECONDS!) * 1000),
      sameSite: 'strict',
      httpOnly: true,
    })
    res.cookie('planForYouRefreshToken', tokens.refresh_token, {
      expires: new Date(new Date().getTime() + parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS!) * 1000),
      sameSite: 'strict',
      httpOnly: true,
    })
    res.send()
  }

  @ApiOperation({
    summary: 'Remove user from database'
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully removed.'
  })
  @ApiCookieAuth()
  @UseGuards(AtGuard)
  @Post('remove')
  @HttpCode(HttpStatus.OK)
  removeUser(@GetCurrentUserId() userId: number) {
    return this.authService.removeUser(userId)
  }
}
