import { Controller, Post } from '@nestjs/common';
import { CreatePlanMeetingRequest } from './dtos/createPlanMeetingRequest.dto';
import { CreatePlanMeetingResponse } from './dtos/createPlanMeetingResponse.dto';
import { PlanMeetingService } from './plan_meeting.service';


@Controller('plan-meeting')
export class PlanMeetingController {

    constructor(private planMeetingService: PlanMeetingService){
        
    }

    @Post()
    async createPlanMeeting(createPlanMeetingRequest: CreatePlanMeetingRequest): Promise<CreatePlanMeetingResponse>{     
        return this.planMeetingService.createPlanMeeting(createPlanMeetingRequest);
    };

   

}
