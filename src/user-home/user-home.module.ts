import { Module } from '@nestjs/common';
import { UserHomeController } from './user-home.controller';
import { UserHomeService } from './user-home.service';

@Module({
  controllers: [UserHomeController],
  providers: [UserHomeService]
})
export class UserHomeModule {}