import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
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
    @InjectConnection() private connection: Connection,
  ) { };

  async create(createPizzaDto: CreatePizzaDto): Promise<Pizza> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const newPizza = new this.pizzaModel(createPizzaDto);
      const dataCollection = new this.dataCollectionModel({ action: 'create', data: newPizza });

      await dataCollection.save({ session });
      const newPizzaData = await newPizza.save({ session });

      await session.commitTransaction();

      return newPizzaData;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const previousData = await this.pizzaModel.findById(id).exec();
      const updatedPizza = await this.pizzaModel.findByIdAndUpdate(id, updatePizzaDto, { new: true, session }).exec();
      const dataCollection = new this.dataCollectionModel({ action: 'update', data: updatedPizza, previousData: previousData });
      if (!updatedPizza) {
        throw new NotFoundException('Pizza not found');
      }

      await dataCollection.save({ session });

      await session.commitTransaction();

      return updatedPizza;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async remove(id: string): Promise<string> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const previousData = await this.pizzaModel.findById(id).exec();
      const deletedPizza = await this.pizzaModel.findByIdAndDelete(id, { session }).exec();
      const dataCollection = new this.dataCollectionModel({ action: 'delete', data: previousData });

      if (!deletedPizza) {
        throw new NotFoundException('Pizza not found');
      }

      await dataCollection.save({ session });

      await session.commitTransaction();

      return deletedPizza._id.toString() + ' deleted successfully';
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
