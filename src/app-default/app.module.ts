import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserAuthModule } from '../user-auth/user-auth.module'
import { PlanMeetingModule } from '../plan-meeting/plan-meeting.module'
import { PrismaModule } from '../app-prisma/prisma.module'
import { UserHomeModule } from '../user-home/user-home.module'

@Module({
  imports: [PrismaModule, PlanMeetingModule, UserAuthModule, UserHomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
