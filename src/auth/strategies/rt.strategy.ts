import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { env } from 'process'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    var cookieExtractor = function (req: any) {
      var token = null
      if (req && req.cookies) {
        token = req.cookies['planForYouRefreshToken']
      }
      return token
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies[env.REFRESH_TOKEN_COOKIE!]
    if (!refreshToken) {
      throw new BadRequestException('Refresh token cookie is not set')
    }
    return {
      ...payload,
      refreshToken,
    }
  }
}