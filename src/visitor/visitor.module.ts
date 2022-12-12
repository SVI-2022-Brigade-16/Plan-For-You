import { Module } from '@nestjs/common'
import { VisitorViewController } from './visitor.controller.view'

@Module({
  controllers: [VisitorViewController]
})
export class VisitorModule { }
