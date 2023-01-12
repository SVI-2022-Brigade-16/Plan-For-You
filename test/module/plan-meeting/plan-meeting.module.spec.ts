import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from '../../../src/prisma/prisma.module'
import { PlanMeetingPrisma } from '../../../src/plan/meeting/plan-meeting.prisma'
import { PlanMeetingService } from '../../../src/plan/meeting/plan-meeting.service'
import { PlanMeetingApiController } from '../../../src/plan/meeting/plan-meeting.controller.api'

describe('PlanMeetingModule', () => {

  let controller: PlanMeetingApiController
  let service: PlanMeetingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [PlanMeetingApiController],
      providers: [PlanMeetingService, PlanMeetingPrisma]
    }).compile()

    controller = module.get<PlanMeetingApiController>(PlanMeetingApiController)
    service = module.get<PlanMeetingService>(PlanMeetingService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })

})
