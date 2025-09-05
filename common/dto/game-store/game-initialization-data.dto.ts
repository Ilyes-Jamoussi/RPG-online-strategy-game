import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';

export interface GameInitializationDataDto {
    mapSize: MapSize;
    map: Tile[][];
    itemContainers: ItemContainer[];
}
