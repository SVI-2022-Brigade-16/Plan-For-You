import { ApiProperty } from "@nestjs/swagger"

export class MeetingAnswerDto {

  @ApiProperty()
  id: number

  @ApiProperty()
  participantName: string

}