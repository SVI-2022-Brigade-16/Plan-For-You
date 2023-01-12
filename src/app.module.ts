import { Module } from '@nestjs/common'
import { AppBaseModule } from './app.module.base'
import { PlanMeetingModule } from './plan/meeting/plan-meeting.module'
import { UserModule } from './user/user.module'
import { VisitorModule } from './visitor/visitor.module'

@Module({
  imports: [AppBaseModule, PlanMeetingModule, UserModule, VisitorModule]
})
export class AppModule { }
