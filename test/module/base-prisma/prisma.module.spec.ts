import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from '../../../src/base-prisma/prisma.module'
import { PrismaService } from '../../../src/base-prisma/prisma.service'

describe('PrismaModule', () => {

  let service: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule]
    }).compile()

    service = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

})
