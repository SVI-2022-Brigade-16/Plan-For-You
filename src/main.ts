import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app-default/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('The best Plan-For-You')
    .setDescription('The API of Plan-For-You.')
    .setVersion('0.4')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  console.log("App started!")
  await app.listen(3000)
}
bootstrap()
