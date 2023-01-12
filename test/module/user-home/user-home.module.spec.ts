import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from '../../../src/prisma/prisma.module'
import { UserApiController } from '../../../src/user/user.controller.api'
import { UserModule } from '../../../src/user/user.module'
import { UserService } from '../../../src/user/user.service'

describe('UserHomeModule', () => {
  let controller: UserApiController
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
    }).compile()

    controller = module.get<UserApiController>(UserApiController)
    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })
})
