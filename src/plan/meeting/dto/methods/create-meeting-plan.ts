import { ApiProperty } from '@nestjs/swagger'
import { MeetingPlan } from '../objects/meeting-plan.dto'

export namespace CreateMeetingPlan {

  export class Request extends MeetingPlan { }

  export class Response {

    @ApiProperty()
    planUuid: String

  }

}
