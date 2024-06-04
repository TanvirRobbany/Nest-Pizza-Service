import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PizzaModule } from './pizza/pizza.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/pizzaDB?replicaSet=rs0'),
    PizzaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
