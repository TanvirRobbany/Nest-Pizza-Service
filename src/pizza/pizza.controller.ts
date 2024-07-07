import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('pizzas')
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

  @ApiOperation({ summary: 'Create a new pizza' })
  @ApiResponse({ status: 201, description: 'The pizza has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  create(@Body() createPizzaDto: CreatePizzaDto) {
    return this.pizzaService.create(createPizzaDto);
  }

  @ApiOperation({ summary: 'Get all pizzas' })
  @ApiResponse({ status: 200, description: 'The pizzas have been successfully returned.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get()
  findAll() {
    return this.pizzaService.findAll();
  }

  @ApiOperation({ summary: 'Get a single pizza' })
  @ApiResponse({ status: 200, description: 'The pizza has been successfully returned.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pizzaService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a pizza' })
  @ApiResponse({ status: 200, description: 'The pizza has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePizzaDto: UpdatePizzaDto) {
    return this.pizzaService.update(id, updatePizzaDto);
  }

  @ApiOperation({ summary: 'Delete a pizza' })
  @ApiResponse({ status: 200, description: 'The pizza has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pizzaService.remove(id);
  }
}
