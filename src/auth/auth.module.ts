import { Module } from '@nestjs/common'
import { AuthApiController } from './auth.controller.api'
import { AuthService } from './auth.service'
import { AtStrategy, RtStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthApiController],
  providers: [AuthService, AtStrategy, RtStrategy]
})
export class AuthModule { }