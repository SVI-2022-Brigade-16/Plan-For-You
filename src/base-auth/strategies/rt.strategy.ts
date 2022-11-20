import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { env } from 'process'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: any) {
    const authorizatioHeader = req.get('authorization')
    if (!authorizatioHeader) {
      throw new BadRequestException('Refresh request has no authorization header')
    }
    const refreshToken = authorizatioHeader.replace('Bearer', '').trim()
    return {
      ...payload,
      refreshToken,
    }
  }
}