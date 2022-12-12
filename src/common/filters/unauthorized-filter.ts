import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, UnauthorizedException, HttpException } from '@nestjs/common'
import { Response } from 'express'

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {

  catch(_exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    if (!request.url.includes('/api')) {
      response.redirect('/')
    }
    response
      .status(401)
      .json({
        statusCode: 401,
        message: 'Unauthorized API call'
      })
      .send()
  }

}