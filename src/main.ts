import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { join } from 'path'
import * as hbs from 'hbs'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { NotFoundFilter } from './common/filters/not-found-filter'
import { UnauthorizedFilter } from './common/filters/unauthorized-filter'
import { BadRequestFilter } from './common/filters/bad-request-filter'


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = new DocumentBuilder()
    .setTitle('The Plan-For-You API')
    .setDescription('The API configuration of the Plan-For-You project.')
    .setVersion('0.5')
    .addCookieAuth('planForYouAccessToken')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())
  app.useGlobalFilters(new BadRequestFilter())
  app.useGlobalFilters(new UnauthorizedFilter())
  app.useGlobalFilters(new NotFoundFilter())
  app.setViewEngine('hbs')
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views/pages'))
  hbs.registerPartials(join(__dirname, '..', 'views/partials'))

  console.log('App started!')
  await app.listen(3000)
}
bootstrap()
