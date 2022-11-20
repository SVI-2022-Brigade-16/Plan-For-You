import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../../src/base-app/app.module'
import { AppService } from '../../../src/base-app/app.service'

describe('AppModule', () => {
  let service: AppService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    service = module.get<AppService>(AppService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
