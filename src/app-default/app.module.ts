import { Module } from '@nestjs/common'
import { UserAuthModule } from 'src/user-auth/user-auth.module'
import { PlanMeetingModule } from 'src/plan-meeting/plan-meeting.module'
import { PrismaModule } from 'src/app-prisma/prisma.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserHomeModule } from 'src/user-home/user-home.module'

@Module({
  imports: [PrismaModule, PlanMeetingModule, UserAuthModule, UserHomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
