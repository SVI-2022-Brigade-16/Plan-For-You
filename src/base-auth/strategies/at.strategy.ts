import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { env } from 'process'

type JwtPayload = {
  sub: string
  email: string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private AuthService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.ACCESS_TOKEN_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    let userId = parseInt(payload.sub)
    let signedIn = await this.AuthService.signedIn(userId)
    if (!signedIn) {
      throw new UnauthorizedException('User is not signed in')
    }
    return payload
  }
}