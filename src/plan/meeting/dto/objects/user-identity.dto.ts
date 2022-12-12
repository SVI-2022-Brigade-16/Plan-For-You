import { ApiProperty } from '@nestjs/swagger'

export class UserIdentity {

  @ApiProperty()
  id: number

  @ApiProperty()
  nickname: string

}