import { Prisma, PrismaClient } from '@prisma/client'
import { Injectable, OnModuleInit } from '@nestjs/common'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    })
  }
  async onModuleInit() {
    this.$on<any>('query', (e) => {
    })
    await this.$connect()
  }

}
