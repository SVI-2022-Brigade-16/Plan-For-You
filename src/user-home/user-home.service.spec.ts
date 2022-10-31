import { Test, TestingModule } from '@nestjs/testing';
import { UserHomeService } from './user-home.service';

describe('UserHomeService', () => {
  let service: UserHomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHomeService],
    }).compile();

    service = module.get<UserHomeService>(UserHomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
