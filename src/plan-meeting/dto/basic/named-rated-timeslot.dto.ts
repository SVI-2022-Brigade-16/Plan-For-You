import { ApiProperty } from "@nestjs/swagger"
import { RatedTimeslotDto } from "./rated-timeslot.dto"

export class NamedRatedTimeslotDto extends RatedTimeslotDto {
  @ApiProperty()
  participantName: string
}