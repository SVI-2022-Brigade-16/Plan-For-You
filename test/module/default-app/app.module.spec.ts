import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from '../../../src/default-app/app.controller'
import { AppModule } from '../../../src/default-app/app.module'
import { AppService } from '../../../src/default-app/app.service'

describe('AppModule', () => {
  let controller: AppController
  let service: AppService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    controller = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it("should return 'Hello World!'", () => {
      expect(controller.getHello()).toBe('Hello World!')
    })
  })
})
