import { Module } from '@nestjs/common'
import { UserViewController } from './user.controller.view'
import { UserBaseModule } from './user.module.base'

@Module({
  imports: [UserBaseModule],
  controllers: [UserViewController]
})
export class UserModule { }
