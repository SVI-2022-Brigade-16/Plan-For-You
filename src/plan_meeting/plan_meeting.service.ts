import { Injectable } from '@nestjs/common';
import { CreatePlanMeetingRequest } from './dtos/createPlanMeetingRequest.dto';
import { CreatePlanMeetingResponse } from './dtos/createPlanMeetingResponse.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PlanMeetingDto } from './dtos/planMeetingDto.dto';

@Injectable()
export class PlanMeetingService {
    constructor(private prismaService: PrismaService) { }
    async createPlanMeeting(createPlanMeetingRequest: CreatePlanMeetingRequest): Promise<CreatePlanMeetingResponse>{     

        let pMDto: PlanMeetingDto = new PlanMeetingDto()
        pMDto.userID = 1
        console.log(pMDto)
        //console.log(this.prismaService.planMeeting.create({ data: pMDto }))
        return {planUuid:"1"};
    };
}
