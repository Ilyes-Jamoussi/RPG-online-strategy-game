import { MapSize } from '@common/enums/map-size.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ItemContainer, itemContainerSchema } from './item-container.schema';
import { Tile, tileSchema } from './tile.schema';

export type GameDocument = Game & Document;

@Schema({ versionKey: false })
export class Game {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, enum: MapSize })
    size: MapSize;

    @Prop({ required: true, type: [[tileSchema]] })
    map: Tile[][];

    @Prop({ required: true, type: [itemContainerSchema] })
    itemContainers: ItemContainer[];

    @Prop({ required: true })
    mapPreviewImageUrl: string;

    @Prop({ required: true, default: false })
    visibility: boolean;

    @Prop({ required: true, default: Date.now })
    lastModified: Date;
}

export const gameSchema = SchemaFactory.createForClass(Game);
