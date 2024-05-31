import { Module } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Pizza, PizzaSchema} from './schemas/pizza.shcema';

@Module({
  imports: [MongooseModule.forFeature([{name: Pizza.name, schema: PizzaSchema}])],
  controllers: [PizzaController],
  providers: [PizzaService],
})
export class PizzaModule {}
