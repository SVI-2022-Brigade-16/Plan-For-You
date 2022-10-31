import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, PayloadTooLargeException, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

type JwtPayload = {
  sub: string
  email: string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'at-secret',
    })
  }

  async validate(payload: JwtPayload) {
    let userId = parseInt(payload.sub)
    let accessTokenActive = await this.authService.hasActiveAccessToken(userId)
    if (!accessTokenActive) {
      throw new UnauthorizedException('User is not signed in')
    }
    return payload
  }
}