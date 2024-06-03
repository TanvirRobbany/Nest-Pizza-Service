import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Pizza, PizzaSchema} from './schemas/pizza.shcema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Pizza.name, schema: PizzaSchema}]),
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'order_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ])
  ],
  controllers: [PizzaController],
  providers: [PizzaService],
})
export class PizzaModule {}
