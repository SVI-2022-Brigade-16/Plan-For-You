import { ForbiddenException, Injectable } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { AuthDto } from "./dto"
import * as bcrypt from 'bcrypt'
import { Tokens } from "./types"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async signup(dto: AuthDto): Promise<Tokens> {
    // generate the password hash
    const hash = await this.hashData(dto.password)
    // save the new user in db
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          nickname: dto.nickname
        }
      })

      const tokens = await this.getTokens(newUser.id, newUser.email)
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

  async signin(dto: AuthDto): Promise<Tokens> {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    // if user doesn't exist throw exception
    if (!user)
      throw new ForbiddenException('User credentials incorrect')
    // compare passwords
    const pwMatches = await bcrypt.compare(
      dto.password,
      user.hash,
    )
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException(
        'Password credentials incorrect',
      )

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRtHash(user.id, tokens.refresh_token)
    return tokens
  }

  async signout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null
      }
    })
  }

  async deleteUser(userId: number) {
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
    if (!user || !user.hashedRt) throw new ForbiddenException("Access Denied")

    const rtMatches = await bcrypt.compare(rt, user.hashedRt)
    if (!rtMatches) throw new ForbiddenException("Refresh token expired")

    const tokens = await this.getTokens(user.id, user.email)
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
        hashedRt: hash,
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
