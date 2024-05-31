import { Test, TestingModule } from '@nestjs/testing';
import { PizzaController } from './pizza.controller';
import { PizzaService } from './pizza.service';

describe('PizzaController', () => {
  let controller: PizzaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PizzaController],
      providers: [PizzaService],
    }).compile();

    controller = module.get<PizzaController>(PizzaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
