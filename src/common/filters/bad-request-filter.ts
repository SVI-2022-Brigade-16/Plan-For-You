import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, UnauthorizedException, HttpException, BadRequestException } from '@nestjs/common'
import { Response } from 'express'

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    if (!request.url.includes('/api')) {
      response.redirect('/')
    } else {
      response
        .status(400)
        .json({
          statusCode: 400,
          message: exception.message
        })
        .send()
    }
  }

}