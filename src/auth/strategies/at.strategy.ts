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
    var cookieExtractor = function (req) {
      var token = null
      if (req && req.cookies) {
        token = req.cookies['planForYouAccessToken']
      }
      return token
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: env.ACCESS_TOKEN_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    let userId = parseInt(payload.sub)
    let signedIn = await this.AuthService.signedIn(userId)
    if (!signedIn) {
      throw new UnauthorizedException('User is not signed in!')
    }
    return payload
  }
}