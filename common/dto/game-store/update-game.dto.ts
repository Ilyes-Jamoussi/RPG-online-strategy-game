import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';

export interface UpdateGameDto {
    readonly name: string;
    readonly description: string;
    readonly map: Tile[][];
    readonly items: ItemContainer[];
    readonly mapPreviewImage: string;
}
