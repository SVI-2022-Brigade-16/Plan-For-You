import { Module } from '@nestjs/common'
import { PlanMeetingModule } from 'src/plan-meeting/plan-meeting.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [PlanMeetingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
