import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './base-app/app.module'
import { join } from 'path'
import * as hbs from 'hbs'
import { NestExpressApplication } from '@nestjs/platform-express'


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = new DocumentBuilder()
    .setTitle('The best Plan-For-You')
    .setDescription('The API of Plan-For-You.')
    .setVersion('0.5')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.setViewEngine('hbs')
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  hbs.registerPartials(join(__dirname, '..', 'views/partials'))

  console.log('App started!')
  await app.listen(3000)
}
bootstrap()
