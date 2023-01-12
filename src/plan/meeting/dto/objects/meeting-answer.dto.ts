import { ApiProperty } from '@nestjs/swagger'

export class MeetingAnswer {

  @ApiProperty()
  id: number

  @ApiProperty()
  participantName: string

  constructor(id: number, participantName: string) {
    this.id = id
    this.participantName = participantName
  }

}