import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from '../../../src/base-prisma/prisma.module'
import { UserHomeController } from '../../../src/user/user-home.controller'
import { UserHomeModule } from '../../../src/user/user.module'
import { UserHomeService } from '../../../src/user/user.service'

describe('UserHomeModule', () => {
  let controller: UserHomeController
  let service: UserHomeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserHomeModule, PrismaModule],
    }).compile()

    controller = module.get<UserHomeController>(UserHomeController)
    service = module.get<UserHomeService>(UserHomeService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })
})
