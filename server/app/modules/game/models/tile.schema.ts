import { ItemType } from '@common/enums/item-type.enum';
import { TileType } from '@common/enums/tile-type.enum';
import { Tile as TileInterface } from '@common/interfaces/tile.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TileDocument = Tile & Document;

@Schema({ _id: false }) // _id: false car c'est un sous-document
export class Tile implements TileInterface {
    @Prop({ required: true, enum: TileType })
    type: TileType;

    @Prop({ enum: ['open', 'closed'], default: undefined })
    doorState?: 'open' | 'closed';

    @Prop({ enum: Object.values(ItemType), required: false, default: null, type: String })
    item: ItemType | null;
}

export const tileSchema = SchemaFactory.createForClass(Tile);
