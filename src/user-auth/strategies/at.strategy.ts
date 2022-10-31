import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, PayloadTooLargeException, UnauthorizedException } from '@nestjs/common'
import { UserAuthService } from '../user-auth.service'

type JwtPayload = {
  sub: string
  email: string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userAuthService: UserAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'at-secret',
    })
  }

  async validate(payload: JwtPayload) {
    let userId = parseInt(payload.sub)
    let accessTokenActive = await this.userAuthService.hasActiveAccessToken(userId)
    if (!accessTokenActive) {
      throw new UnauthorizedException('User is not signed in')
    }
    return payload
  }
}