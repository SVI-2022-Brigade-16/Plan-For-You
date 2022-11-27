import { Module } from '@nestjs/common'
import { UserHomeApiController } from './user-home.controller.api'
import { UserHomeViewController } from './user-home.controller.view'
import { UserHomeService } from './user-home.service'

@Module({
  controllers: [UserHomeApiController, UserHomeViewController],
  providers: [UserHomeService]
})
export class UserHomeModule { }
