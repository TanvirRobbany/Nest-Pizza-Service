import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pizza extends Document {
    @Prop()
    name: string;

    @Prop()
    size: string;

    @Prop()
    crust: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;
}

export const PizzaSchema = SchemaFactory.createForClass(Pizza);
PizzaSchema.set('timestamps', true);