import { Module } from '@nestjs/common'
import { UserApiController } from './user.controller.api'
import { UserService } from './user.service'

@Module({
  controllers: [UserApiController],
  providers: [UserService],
  exports: [UserService]
})
export class UserBaseModule { }
