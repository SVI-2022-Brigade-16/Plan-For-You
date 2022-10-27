import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreatePlanMeetingResponse {
    @IsNotEmpty()
    planUuid:string;

}
