import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';

export interface GameDto {
    readonly id: string;
    readonly size: MapSize;
    readonly name: string;
    readonly description: string;
    readonly map: Tile[][];
    readonly items: ItemContainer[];
    readonly mapImageUrl: string;
    readonly lastModified: Date;
    readonly visibility: boolean;
}
