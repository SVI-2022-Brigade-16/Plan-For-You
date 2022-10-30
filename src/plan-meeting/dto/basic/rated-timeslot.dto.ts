import { ApiProperty } from "@nestjs/swagger"
import { TimeslotDto } from "./timeslot.dto"

export class RatedTimeslotDto extends TimeslotDto {
  @ApiProperty()
  rating: number
}