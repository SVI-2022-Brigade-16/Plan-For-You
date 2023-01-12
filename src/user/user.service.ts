import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ReadUserResponse } from './dto/response/read-user.response'

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async readUser(userId: number): Promise<ReadUserResponse> {
    if (userId == undefined) {
      throw new UnauthorizedException('User ID is undefined')
    }
    let findUser = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        nickname: true,
        meetingPlans: {
          select: {
            uuid: true,
            planName: true,
            receivingAnswers: true
          }
        }
      }
    })
    if (!findUser) {
      throw new NotFoundException('User with given ID was not found')
    }
    return findUser
  }

}
