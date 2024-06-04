import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { Pizza } from './schemas/pizza.shcema';
import { DataCollection } from './schemas/collection.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class PizzaService {
  constructor(
    @InjectModel(Pizza.name) private pizzaModel: Model<Pizza>,
    @InjectModel(DataCollection.name) private dataCollectionModel: Model<DataCollection>,
  ) { };

  async create(createPizzaDto: CreatePizzaDto): Promise<Pizza> {
    const newPizza = new this.pizzaModel(createPizzaDto);
    const dataCollection = new this.dataCollectionModel(createPizzaDto);
    dataCollection.save();
    return newPizza.save();
  }

  async findAll(): Promise<Pizza[]> {
    return this.pizzaModel.find({}).exec();
  }

  async findOne(id: string): Promise<Pizza> {
    const pizza = await this.pizzaModel.findById(id).exec();
    if (!pizza) {
      throw new NotFoundException('Pizza not found');
    }
    return pizza;
  }

  async update(id: string, updatePizzaDto: UpdatePizzaDto): Promise<Pizza> {
    const previousData = await this.pizzaModel.findById(id).exec();
    const updatedPizza = await this.pizzaModel.findByIdAndUpdate(id, updatePizzaDto, { new: true }).exec();
    const dataCollection = new this.dataCollectionModel({ action: 'update', data: updatedPizza, previousData: previousData });
    
    if (!updatedPizza) {
      throw new NotFoundException('Pizza not found');
    }

    dataCollection.save();

    return updatedPizza;
  }

  async remove(id: string): Promise<string> {
    const previousData = await this.pizzaModel.findById(id).exec();
    const deletedPizza = await this.pizzaModel.findByIdAndDelete(id).exec();
    const dataCollection = new this.dataCollectionModel({ action: 'delete', data: previousData });
    
    if (!deletedPizza) {
      throw new NotFoundException('Pizza not found');
    }

    dataCollection.save();

    return deletedPizza._id.toString() + ' deleted successfully';
  }

  async handleOrderProcess(@Payload() order: any) {
    const pizza = await this.findOne(order.pizza_id);
    let result = {
      message: '',
      order,
      status: '', //accepted, rejected
    }
    if (!pizza) {
      result.message = 'Pizza not fount',
        result.status = 'rejected';
      return result;
    }
    else {
      if (pizza.quantity >= order.quantity) {
        pizza.quantity = pizza.quantity - order.quantity;
        await this.update(order.pizza_id, { quantity: pizza.quantity });
        result.message = 'Order Accepted';
        result.status = 'accepted';
        return result;
      }
      else {
        result.message = 'Insufficient quantity in stock';
        result.status = 'rejected';
        return result;
      }
    }
  }
}
