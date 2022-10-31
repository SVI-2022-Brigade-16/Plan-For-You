import { ApiProperty } from '@nestjs/swagger'
import { RatedTimeslotDto } from './rated-timeslot.dto'

export class TotalRatedTimeslotDto extends RatedTimeslotDto {

  @ApiProperty()
  lowerRatingParticipantNames: string[]

}