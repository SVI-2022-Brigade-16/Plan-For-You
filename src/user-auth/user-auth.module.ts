import { Module } from '@nestjs/common'
import { UserAuthController } from './user-auth.controller'
import { UserAuthService as UserAuthService } from './user-auth.service'
import { AtStrategy, RtStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserAuthController],
  providers: [UserAuthService, AtStrategy, RtStrategy]
})
export class UserAuthModule { }