import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, UnauthorizedException, HttpException } from '@nestjs/common'
import { Response } from 'express'

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {

  catch(_exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    if (!request.url.includes('/api')) {
      response.redirect('/')
    }
    response
      .status(404)
      .json({
        statusCode: 404,
        message: 'What you were looking for was not found'
      })
      .send()
  }

}