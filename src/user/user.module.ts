import { Module } from '@nestjs/common'
import { UserViewController } from './user.controller.view'
import { UserBaseModule } from './user.base.module'

@Module({
  imports: [UserBaseModule],
  controllers: [UserViewController]
})
export class UserModule { }
