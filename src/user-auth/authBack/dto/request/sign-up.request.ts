import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { AuthDto } from "../auth.dto"

export class SignUpRequest extends AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string
}