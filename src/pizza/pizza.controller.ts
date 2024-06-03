import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('pizza')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  // @EventPattern('order_process')
  // async handleOrderCreated(@Payload() data: any) {
  //   const pizza = await this.findOne(data.pizza_id);
  //   // console.log('Recived order_process event----->', data, pizza);
  // }

  @EventPattern('order_process')
  async handleOrderProcess(@Payload() order: any) {
    return this.pizzaService.handleOrderProcess(order);
  }

  @Post()
  create(@Body() createPizzaDto: CreatePizzaDto) {
    return this.pizzaService.create(createPizzaDto);
  }

  @Get()
  findAll() {
    return this.pizzaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pizzaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePizzaDto: UpdatePizzaDto) {
    return this.pizzaService.update(id, updatePizzaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pizzaService.remove(id);
  }
}
