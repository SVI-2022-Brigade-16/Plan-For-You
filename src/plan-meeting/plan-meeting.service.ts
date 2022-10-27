import { Injectable } from '@nestjs/common'
import { CreatePlanMeetingRequest } from './request/create-plan-meeting.request'
import { CreatePlanMeetingResponse } from './response/create-plan-meeting.response'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePlanMeetingDto } from './dto/create-plan-meeting.dto'

@Injectable()
export class PlanMeetingService {

  constructor(private prismaService: PrismaService) { }

  async createPlanMeeting(createPlanMeetingRequest: CreatePlanMeetingRequest): Promise<CreatePlanMeetingResponse> {

    let createPlanMeetingDto: CreatePlanMeetingDto = new CreatePlanMeetingDto()
    createPlanMeetingDto.userId = 1
    console.log(createPlanMeetingDto)
    //console.log(this.prismaService.planMeeting.create({ data: pMDto }))
    return { planUuid: "1" }

  };

}
