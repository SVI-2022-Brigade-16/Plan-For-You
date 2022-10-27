import { Test, TestingModule } from '@nestjs/testing';
import { PlanMeetingService } from './plan_meeting.service';

describe('PlanMeetingService', () => {
  let service: PlanMeetingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanMeetingService],
    }).compile();

    service = module.get<PlanMeetingService>(PlanMeetingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
