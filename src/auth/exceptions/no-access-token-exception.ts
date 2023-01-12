import { HttpException, UnauthorizedException } from "@nestjs/common"

export class TokenException extends UnauthorizedException { }

export class NoAccessTokenException extends TokenException { }

export class ExpiredAccessTokenException extends TokenException { }