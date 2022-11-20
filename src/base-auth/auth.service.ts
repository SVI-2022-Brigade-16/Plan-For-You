import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../base-prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as bcrypt from 'bcrypt'
import { Tokens } from './types'
import { JwtService } from '@nestjs/jwt'
import { SignInRequest } from './dto/request/sign-in.request'
import { SignUpRequest } from './dto/request/sign-up.request'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async signedIn(userId: number): Promise<boolean> {
    let user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user || user.signedOut) {
      return false
    }
    return true
  }

  async signup(request: SignUpRequest): Promise<Tokens> {
    // generate the password hash
    const hashedPassword = await this.hashData(request.password)
    // save the new user in db
    try {
      const newUser = await this.prisma.user.create({
        data: {
          login: request.login,
          hashedPassword: hashedPassword,
          nickname: request.nickname,
          signedOut: false
        }
      })

      const tokens = await this.getTokens(newUser.id, newUser.login)
      await this.updateRtHash(newUser.id, tokens.refresh_token)
      return tokens

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential taken')
        }
      }
      throw error
    }
  }

  async signin(request: SignInRequest): Promise<Tokens> {
    // find the user by email
    let user = await this.prisma.user.findUnique({
      where: {
        login: request.login,
      }
    })
    // if user doesn't exist throw exception
    if (!user)
      throw new ForbiddenException('User credentials incorrect')
    // compare passwords
    const pwMatches = await bcrypt.compare(
      request.password,
      user.hashedPassword,
    )
    // if password incorrect, throw exception
    if (!pwMatches) {
      throw new ForbiddenException(
        'Password credentials incorrect',
      )
    }
    const tokens = await this.getTokens(user.id, user.login)
    await this.prisma.user.update({
      where: {
        login: request.login,
      },
      data: {
        signedOut: false
      }
    })
    await this.updateRtHash(user.id, tokens.refresh_token)
    return tokens
  }

  async signout(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        signedOut: true,
        hashedRefreshToken: null
      }
    })
  }

  async removeUser(userId: number) {
    await this.prisma.user.delete({
      where: {
        id: userId,
      }
    })
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied')
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken)
    if (!rtMatches) {
      throw new ForbiddenException('Refresh token expired')
    }

    const tokens = await this.getTokens(user.id, user.login)
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        signedOut: false
      }
    })
    await this.updateRtHash(user.id, tokens.refresh_token)
    return tokens
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt)
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hash,
      },
    })
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ])

    return {
      access_token: at,
      refresh_token: rt,
    }
  }
}
