import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {AtGuard, RtGuard} from "../authDefence/guards";
import {GetCurrentUser, GetCurrentUserId} from "../authDefence/decorators";


@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signup(dto);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signin(dto)
    }

    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    signout(@GetCurrentUserId() userId: number){
        return this.authService.signout(userId);
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string)
        {
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @UseGuards(AtGuard)
    @Post('delete')
    @HttpCode(HttpStatus.OK)
    deleteUser(@GetCurrentUserId() userId: number)
    {
        return this.authService.deleteUser(userId);
    }
}
