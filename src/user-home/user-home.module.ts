import { Module } from '@nestjs/common'
import { UserHomeController } from './user-home.controller.api'
import { UserHomeViewController } from './user-home.controller.view'
import { UserHomeService } from './user-home.service'

@Module({
  controllers: [UserHomeController, UserHomeViewController],
  providers: [UserHomeService]
})
export class UserHomeModule { }
