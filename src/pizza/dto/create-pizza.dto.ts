import { ApiProperty } from "@nestjs/swagger";

export class CreatePizzaDto {
    @ApiProperty({ example: 'Hawaiian', description: 'Name of the pizza' })
    name: string;

    @ApiProperty({ example: 'large', description: 'Size of the pizza' })
    size: string;

    @ApiProperty({ example: 'Stuffed', description: 'Crust of the pizza' })
    crust: string;

    @ApiProperty({ example: 2, description: 'Quantity of the pizza' })
    quantity: number;

    @ApiProperty({ example: 200, description: 'Price of the pizza' })
    price: number;
}
