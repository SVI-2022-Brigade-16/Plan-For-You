import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthModule } from '../base-auth/auth.module'
import { PlanMeetingModule } from '../plan-meeting/plan-meeting.module'
import { PrismaModule } from '../base-prisma/prisma.module'
import { UserHomeModule } from '../user-home/user-home.module'

@Module({
  imports: [PrismaModule, AuthModule, PlanMeetingModule, UserHomeModule],
  providers: [AppService],
})
export class AppModule { }
