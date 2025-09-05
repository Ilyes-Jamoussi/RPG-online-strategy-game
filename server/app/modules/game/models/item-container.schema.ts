import { ItemType } from '@common/enums/item-type.enum';
import { ItemContainer as ItemContainerInterface } from '@common/interfaces/item-container.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemContainerDocument = ItemContainer & Document;

@Schema({ _id: false })
export class ItemContainer implements ItemContainerInterface {
    @Prop({ required: true, enum: ItemType })
    item: ItemType;

    @Prop({ required: true, min: 0 })
    count: number;
}

export const itemContainerSchema = SchemaFactory.createForClass(ItemContainer);
