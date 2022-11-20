import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsString, Max, Min } from 'class-validator'

export class UserMeetingPlan {

  @ApiProperty()
  @IsString()
  uuid: string

  @ApiProperty()
  @IsString()
  planName: string

  @ApiProperty()
  @IsBoolean()
  receivingAnswers: boolean

}