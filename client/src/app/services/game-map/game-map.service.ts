import { Injectable } from '@angular/core';
import { ItemType } from '@common/enums/item-type.enum';
import { MAP_SIZE_TO_MAX_PLAYERS, MapSize } from '@common/enums/map-size.enum';
import { TileType } from '@common/enums/tile-type.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';

@Injectable({ providedIn: 'root' })
export class GameMapService {
    buildItemsContainer(size: MapSize): ItemContainer[] {
        return Object.values(ItemType).map((item) => {
            const count = item === ItemType.Random || item === ItemType.SpawnPoint ? MAP_SIZE_TO_MAX_PLAYERS[size] : 1;
            return { item, count };
        });
    }

    buildBaseGrid(size: MapSize): Tile[][] {
        return Array.from({ length: size }, () => Array.from({ length: size }, () => ({ type: TileType.Sand, item: null })));
    }

    buildTileFromType(type: TileType, current: Tile): Tile {
        if (type === TileType.Door) {
            if (current.type === TileType.Door) {
                return { type: TileType.Door, doorState: current.doorState === 'open' ? 'closed' : 'open', item: null };
            }
            return { type: TileType.Door, doorState: 'closed', item: null };
        }

        return { type, item: null };
    }
}
