import { BadRequestException, HttpException } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { IsString, validate, ValidateNested } from "class-validator"
import { PrismaService } from "src/prisma/prisma.service"
import { RatedTimeslotDto } from "../basic/rated-timeslot.dto"
import { TimeslotDto } from "../basic/timeslot.dto"

export class CreateMeetingAnswerRequest {

  @ApiProperty()
  @IsString()
  participantName: string

  @ApiProperty({ type: () => [RatedTimeslotDto] })
  @ValidateNested()
  ratedTimeslots: RatedTimeslotDto[]

  constructor(participantName: string, timeslots: RatedTimeslotDto[]) {
    this.participantName = participantName
    this.ratedTimeslots = []
    console.log(timeslots)
    if (timeslots) {
      for (let i = 0; i < timeslots.length; i++) {
        this.ratedTimeslots.push(new RatedTimeslotDto(timeslots[i]))
      }
    } else {
      console.log("timeslosts undefined!")
    }
  }

  async validate(planUuid: string, prismaService: PrismaService): Promise<CreateMeetingAnswerRequest> {
    const errors = await validate(this)
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed')
    }
    let meetingPlan = await prismaService.meetingPlan.findFirst({
      where: {
        uuid: planUuid
      },
      include: {
        blockedTimeslots: true,
      }
    })
    if (!meetingPlan) {
      throw new BadRequestException('Validation failed: Meeting plan for this answer is not found')
    }

    let sortedBlocked: TimeslotDto[] = meetingPlan!.blockedTimeslots.sort(TimeslotDto.compare)
    let sortedRated: RatedTimeslotDto[] = this.ratedTimeslots.sort(TimeslotDto.compare)
    let blockedIndex = 0

    for (let ratedIndex = 0; ratedIndex < sortedRated.length; ratedIndex++) {
      if (sortedRated[ratedIndex].rating > meetingPlan!.ratingRange) {
        throw new BadRequestException('Validation failed: Answer rating is out of ratingRange for this meeting plan')
      }
      while (TimeslotDto.compare(sortedRated[ratedIndex], sortedBlocked[blockedIndex]) > 0) {
        blockedIndex++
      }
      if (TimeslotDto.compare(sortedRated[ratedIndex], sortedBlocked[blockedIndex]) == 0) {
        throw new BadRequestException('Validation failed: Answer has blocked timeslots in it')
      }
    }

    return this
  }

}
