// board.constants.ts

import { DoorState, TileType } from '@common/enums/tile-type.enum';
import { Position } from '@common/interfaces/position.interface';

export const TILE_MOVEMENT_COST: Record<TileType, number> = {
    [TileType.Sand]: 1,
    [TileType.Ice]: 0,
    [TileType.Water]: 2,
    [TileType.Door]: Infinity,
    [TileType.Wall]: Infinity,
};

export const DOOR_MOVEMENT_COST: Record<DoorState, number> = {
    [DoorState.Open]: 1,
    [DoorState.Closed]: Infinity,
};

export const DIRECTIONS: Record<string, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
} as const;

export type DirectionKey = keyof typeof DIRECTIONS;

export const ORTHOGONAL_DIRECTIONS: readonly Position[] = Object.values(DIRECTIONS);

export const CONTEXT_MENU_DELAY = 1500;
