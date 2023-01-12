import { CreateMeetingAnswer } from './dto/methods/create-meeting-answer'
import { CreateMeetingPlan } from './dto/methods/create-meeting-plan'
import { ReadMeetingAnswer } from './dto/methods/read-meeting-answer'
import { ReadMeetingAnswerForm } from './dto/methods/read-meeting-answer-form'
import { ReadMeetingPlan } from './dto/methods/read-meeting-plan'
import { ReadMeetingPlanResult } from './dto/methods/read-meeting-plan-result'
import { UpdateMeetingPlan } from './dto/methods/update-meeting-plan'


export interface IPlanMeetingService {

  createPlan(userId: number, request: CreateMeetingPlan.Request)
    : Promise<CreateMeetingPlan.Response>

  readPlan(userId: number, planUuid: string)
    : Promise<ReadMeetingPlan.Response>

  updatePlan(userId: number, planUuid: string, request: UpdateMeetingPlan.Request)
    : Promise<void>

  deletePlan(userId: number, planUuid: string)
    : Promise<void>

  updatePublishing(userId: number, planUuid: string, state: number)
    : Promise<void>

  readAnswerConditions(userId: number, planUuid: string)
    : Promise<ReadMeetingAnswerForm.Response>

  readAnswerForm(planUuid: string)
    : Promise<ReadMeetingAnswerForm.Response>

  createAnswer(planUuid: string, request: CreateMeetingAnswer.Request)
    : Promise<void>

  readAnswer(planUuid: string, answerId: number)
    : Promise<ReadMeetingAnswer.Response>

  deleteAnswer(userId: number, planUuid: string, answerId: number)
    : Promise<void>

  readResult(userId: number, planUuid: string)
    : Promise<ReadMeetingPlanResult.Response>

}
