import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { Pizza } from './schemas/pizza.shcema';

@Injectable()
export class PizzaService {
  constructor (@InjectModel(Pizza.name) private pizzaModel: Model<Pizza>) {};

  async create(createPizzaDto: CreatePizzaDto): Promise<Pizza> {
    const newPizza = new this.pizzaModel(createPizzaDto);
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
    const updatedPizza = await this.pizzaModel.findByIdAndUpdate(id, updatePizzaDto, {new: true}).exec();

    if (!updatedPizza) {
      throw new NotFoundException('Pizza not found');
    }

    return updatedPizza;
  }

  async remove(id: string): Promise<string> {
    const deletedPizza = await this.pizzaModel.findByIdAndDelete(id).exec();
    if (!deletedPizza) {
      throw new NotFoundException('Pizza not found');
    }
    return deletedPizza._id.toString() + ' deleted successfully';
  }
}
