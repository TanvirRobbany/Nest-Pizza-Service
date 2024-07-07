import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'pizza_queue',
      queueOptions: {
        durable: false
      }
    }
  });

  await app.startAllMicroservices();
  const config = new DocumentBuilder()
    .setTitle('Pizza Service')
    .setDescription('API documentation for Pizza Service')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
