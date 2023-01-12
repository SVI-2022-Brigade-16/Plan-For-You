import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, validate, ValidateNested } from 'class-validator'
import { PlanMeetingPrisma } from '../../plan-meeting.prisma'
import { MeetingPlanWithAnswerRatings } from '../objects/meeting-plan-with-rating.dto'
import { RatedTimeslot } from '../objects/rated-timeslot.dto'
import { Timeslot } from '../objects/timeslot.dto'

export namespace CreateMeetingAnswer {

  export class Request {

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

    async validate(planUuid: string, prisma: PlanMeetingPrisma): Promise<Request> {
      const errors = await validate(this)
      if (errors.length > 0) {
        throw new BadRequestException('Answer validation failed: Bad input format')
      }
      this.validateForPlan(planUuid, prisma)
      return this
    }

    async validateForPlan(planUuid: string, prisma: PlanMeetingPrisma) {
      let meetingPlan = await this.getPlanOrThrow(planUuid, prisma)
      this.throwIfParticipantExists(meetingPlan)
      this.validateRatings(meetingPlan)
    }

    async getPlanOrThrow(planUuid: string, prisma: PlanMeetingPrisma) {
      if (prisma == undefined) {
        throw new InternalServerErrorException('Answer validation failed: PlanMeetingPrisma not injected')
      }
      try {
        return await prisma.readPlanWithAnswerRatings(planUuid)
      } catch {
        throw new NotFoundException('Answer validation failed: Meeting plan with given UUID was not found')
      }
    }

    throwIfParticipantExists(meetingPlan: MeetingPlanWithAnswerRatings) {
      for (let i = 0; i < meetingPlan.answers.length; i++) {
        if (meetingPlan.answers[i].participantName == this.participantName) {
          throw new BadRequestException('Answer validation failed: Participant with given name for given meeting plan already exists')
        }
      }
    }

    validateRatings(meetingPlan: MeetingPlanWithAnswerRatings) {
      let sBlocked: Timeslot[] = meetingPlan!.blockedTimeslots.sort(Timeslot.compare)
      let sRated: RatedTimeslot[] = this.ratedTimeslots.sort(Timeslot.compare)
      let sBI = 0

      for (let sRI = 0; sRI < sRated.length; sRI++) {
        this.throwIfMoreThanMax(sRated[sRI].rating, meetingPlan!.ratingMax)
        while (sBI < sBlocked.length && Timeslot.compare(sRated[sRI], sBlocked[sBI]) > 0) {
          sBI++
        }
        if (sBI < sBlocked.length && Timeslot.compare(sRated[sRI], sBlocked[sBI]) == 0) {
          throw new BadRequestException('Validation failed: Answer has rated blocked timeslots in it')
        }
      }
    }

    throwIfMoreThanMax(rating: number, ratingMax: number) {
      if (rating > ratingMax) {
        throw new BadRequestException('Answer validation failed: Answer rating is out of rating range for this meeting plan')
      }
    }

  }

}
