import { Test, TestingModule } from '@nestjs/testing';
import { PlanMeetingController } from './plan_meeting.controller';

describe('PlanMeetingController', () => {
  let controller: PlanMeetingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanMeetingController],
    }).compile();

    controller = module.get<PlanMeetingController>(PlanMeetingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
