import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../../src/base-app/app.module'
import { AppService } from '../../../src/base-app/app.service'

describe('AppModule', () => {
  let service: AppService

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
  })
})
