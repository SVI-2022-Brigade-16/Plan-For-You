import { Test, TestingModule } from '@nestjs/testing';
import { UserHomeController } from './user-home.controller';

describe('UserHomeController', () => {
  let controller: UserHomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHomeController],
    }).compile();

    controller = module.get<UserHomeController>(UserHomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
