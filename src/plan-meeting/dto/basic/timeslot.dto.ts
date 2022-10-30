import { ApiProperty } from "@nestjs/swagger"

export class TimeslotDto {
  @ApiProperty()
  dayNum: number

  @ApiProperty()
  timeslotNum: number
}