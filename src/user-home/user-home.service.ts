import { Injectable } from '@nestjs/common'
import { PrismaService } from '../app-prisma/prisma.service'
import { ReadUserResponse } from './dto/response/read-user.response'

@Injectable()
export class UserHomeService {

  constructor(private prismaService: PrismaService) { }

  async readUser(userId: number): Promise<ReadUserResponse> {
    let findUser = await this.prismaService.user.findUnique({
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
    return findUser
  }

}
