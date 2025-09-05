import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';

export interface CreateGameDto {
    readonly size: MapSize;
    readonly name: string;
    readonly description: string;
    readonly map: Tile[][];
    readonly items: ItemContainer[];
    readonly mapPreviewImage: string;
}
