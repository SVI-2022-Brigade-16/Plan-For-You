import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreatePlanMeetingRequest {
    @IsNotEmpty()
    accessToken:string;

    @IsNotEmpty()
    planName:string;
}
