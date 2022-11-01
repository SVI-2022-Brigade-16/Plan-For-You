import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from '../../../src/default-prisma/prisma.module'
import { PlanMeetingController } from '../../../src/plan-meeting/plan-meeting.controller'
import { PlanMeetingService } from '../../../src/plan-meeting/plan-meeting.service'

describe('PlanMeetingModule', () => {

  let controller: PlanMeetingController
  let service: PlanMeetingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [PlanMeetingController],
      providers: [PlanMeetingService]
    }).compile()

    controller = module.get<PlanMeetingController>(PlanMeetingController)
    service = module.get<PlanMeetingService>(PlanMeetingService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })

})
