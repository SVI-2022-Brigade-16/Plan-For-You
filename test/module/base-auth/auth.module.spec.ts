import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from '../../../src/base-prisma/prisma.module'
import { AuthController } from '../../../src/base-auth/auth.controller'
import { AuthModule } from '../../../src/base-auth/auth.module'
import { AuthService } from '../../../src/base-auth/auth.service'

describe('AuthModule', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, PrismaModule],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })
})
