import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { Player } from '@common/models/player.model';

export interface CreateSessionDto {
    mapSize: MapSize;
    player: Player;
    map: Tile[][];
    itemContainers: ItemContainer[];
}

export interface SessionCreatedDto {
    sessionId: string;
    playerId: string;
}
