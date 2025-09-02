import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as client from 'prom-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Benefícios')
    .setDescription('API para gerenciamento de benefícios')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  client.collectDefaultMetrics();

  app.getHttpAdapter().get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
