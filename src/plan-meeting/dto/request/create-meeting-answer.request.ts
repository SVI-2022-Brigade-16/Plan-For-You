import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, validate, ValidateNested } from 'class-validator'
import { PrismaService } from '../../../base-prisma/prisma.service'
import { RatedTimeslot } from '../basic/rated-timeslot.dto'
import { Timeslot } from '../basic/timeslot.dto'

export class CreateMeetingAnswerRequest {

  @ApiProperty()
  @IsString()
  participantName: string

  @ApiProperty({ type: () => [RatedTimeslot] })
  @ValidateNested()
  ratedTimeslots: RatedTimeslot[]

  constructor(participantName: string, timeslots: RatedTimeslot[]) {
    this.participantName = participantName
    this.ratedTimeslots = []
    if (timeslots) {
      for (let i = 0; i < timeslots.length; i++) {
        this.ratedTimeslots.push(new RatedTimeslot(timeslots[i]))
      }
    }
  }

  async validate(planUuid: string, prismaService: PrismaService): Promise<CreateMeetingAnswerRequest> {
    const errors = await validate(this)
    if (errors.length > 0) {
      throw new BadRequestException('Answer validation failed: Bad input format')
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

    if (!meetingPlan) {
      throw new NotFoundException('Answer validation failed: Meeting plan with given UUID was not found')
    }
    for (let i = 0; i < meetingPlan.answers.length; i++) {
      if (meetingPlan.answers[i].participantName == this.participantName) {
        throw new BadRequestException('Answer validation failed: Participant with given name for given meeting plan already exists')
      }
    }

    let sBlocked: Timeslot[] = meetingPlan!.blockedTimeslots.sort(Timeslot.compare)
    let sRated: RatedTimeslot[] = this.ratedTimeslots.sort(Timeslot.compare)
    let sBI = 0

    for (let sRI = 0; sRI < sRated.length; sRI++) {
      if (sRated[sRI].rating > meetingPlan!.ratingMax) {
        throw new BadRequestException('Answer validation failed: Answer rating is out of rating range for this meeting plan')
      }
      while (sBI < sBlocked.length && Timeslot.compare(sRated[sRI], sBlocked[sBI]) > 0) {
        sBI++
      }
      if (sBI < sBlocked.length && Timeslot.compare(sRated[sRI], sBlocked[sBI]) == 0) {
        throw new BadRequestException('Validation failed: Answer has rated blocked timeslots in it')
      }
    }

    return this
  }

}
