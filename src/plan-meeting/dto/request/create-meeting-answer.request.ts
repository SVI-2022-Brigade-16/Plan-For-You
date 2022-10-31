import { BadRequestException, HttpException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, validate, ValidateNested } from 'class-validator'
import { PrismaService } from '../../../app-prisma/prisma.service'
import { RatedTimeslotDto } from '../basic/rated-timeslot.dto'
import { TimeslotDto } from '../basic/timeslot.dto'

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
    if (timeslots) {
      for (let i = 0; i < timeslots.length; i++) {
        this.ratedTimeslots.push(new RatedTimeslotDto(timeslots[i]))
      }
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
        answers: true
      }
    })

    for (let i = 0; i < meetingPlan.answers.length; i++) {
      if (meetingPlan.answers[i].participantName == this.participantName) {
        throw new BadRequestException('Validation failed: Participant with given name for given meeting plan already exists')
      }
    }

    if (!meetingPlan) {
      throw new BadRequestException('Validation failed: Meeting plan for this answer is not found')
    }

    let sBlocked: TimeslotDto[] = meetingPlan!.blockedTimeslots.sort(TimeslotDto.compare)
    let sRated: RatedTimeslotDto[] = this.ratedTimeslots.sort(TimeslotDto.compare)
    let sBI = 0

    for (let sRI = 0; sRI < sRated.length; sRI++) {
      if (sRated[sRI].rating > meetingPlan!.ratingRange) {
        throw new BadRequestException('Validation failed: Answer rating is out of ratingRange for this meeting plan')
      }
      while (sBI < sBlocked.length && TimeslotDto.compare(sRated[sRI], sBlocked[sBI]) > 0) {
        sBI++
      }
      if (sBI < sBlocked.length && TimeslotDto.compare(sRated[sRI], sBlocked[sBI]) == 0) {
        throw new BadRequestException('Validation failed: Answer has blocked timeslots in it')
      }
    }

    return this
  }

}
