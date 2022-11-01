import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from '../../../src/default-prisma/prisma.module'
import { UserAuthController } from '../../../src/user-auth/user-auth.controller'
import { UserAuthModule } from '../../../src/user-auth/user-auth.module'
import { UserAuthService } from '../../../src/user-auth/user-auth.service'

describe('UserAuthModule', () => {
  let controller: UserAuthController
  let service: UserAuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserAuthModule, PrismaModule],
    }).compile()

    controller = module.get<UserAuthController>(UserAuthController)
    service = module.get<UserAuthService>(UserAuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })
})
