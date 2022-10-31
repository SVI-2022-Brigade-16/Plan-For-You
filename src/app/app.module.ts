import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/authBack/auth.module'
import { PlanMeetingModule } from 'src/plan-meeting/plan-meeting.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [PrismaModule, PlanMeetingModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
