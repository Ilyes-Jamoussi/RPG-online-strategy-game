import { Injectable } from '@angular/core';
import { DOOR_MOVEMENT_COST, ORTHOGONAL_DIRECTIONS, TILE_MOVEMENT_COST } from '@app/constants/game-board.constants';
import { ItemType } from '@common/enums/item-type.enum';
import { DoorState, TileType } from '@common/enums/tile-type.enum';
import { BoardTile } from '@common/interfaces/board-tile.interface';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Position } from '@common/interfaces/position.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { Player } from '@common/models/player.model';

@Injectable({ providedIn: 'root' })
export class GameBoardService {
    prepareGameBoard(map: Tile[][], itemContainers: ItemContainer[], players: Player[]): BoardTile[][] {
        const mapCopy: Tile[][] = map.map((row) => row.map((tile) => ({ ...tile })));

        const availableItems = this.shuffleArray(this.getAvailableItemTypes(itemContainers));
        this.replaceRandomItemsInMap(mapCopy, availableItems);

        this.assignSpawnPoints(mapCopy, players);

        return mapCopy.map((row, y) =>
            row.map((tile, x) => {
                const player = players.find((p) => p.startingPoint && p.startingPoint.x === x && p.startingPoint.y === y);
                return {
                    baseTile: tile,
                    occupantId: player?.id ?? null,
                    isReachable: false,
                    isInPath: false,
                    isHighlighted: false,
                };
            }),
        );
    }

    getTileCost(tile: Tile): number {
        if (tile.type === TileType.Door) {
            return DOOR_MOVEMENT_COST[tile.doorState ?? DoorState.Closed];
        }
        return TILE_MOVEMENT_COST[tile.type];
    }

    getReachableTiles(board: BoardTile[][], currentPosition: Position, movementPoints: number): Position[] {
        const reachable: Position[] = [];
        const visited = new Set<string>();
        const queue: { pos: Position; cost: number }[] = [{ pos: currentPosition, cost: 0 }];

        for (const { pos, cost } of queue) {
            const key = `${pos.x},${pos.y}`;
            if (visited.has(key) || cost > movementPoints) continue;
            visited.add(key);
            reachable.push(pos);

            for (const dir of ORTHOGONAL_DIRECTIONS) {
                const nx = pos.x + dir.x;
                const ny = pos.y + dir.y;
                if (!board[ny]?.[nx]) continue;

                const neighbor = board[ny][nx];
                if (neighbor.occupantId) continue;

                const movementCost = this.getTileCost(neighbor.baseTile);
                if (movementCost === Infinity) continue;

                queue.push({ pos: { x: nx, y: ny }, cost: cost + movementCost });
            }
        }

        return reachable;
    }

    highlightReachableAndPath(board: BoardTile[][], currentPosition: Position, movementPoints: number, targetPosition?: Position): BoardTile[][] {
        const reachablePositions = this.getReachableTiles(board, currentPosition, movementPoints);

        const isReachable = (pos: Position) => reachablePositions.some((p) => p.x === pos.x && p.y === pos.y);

        let shortestPath: Position[] = [];

        if (targetPosition && isReachable(targetPosition)) {
            shortestPath = this.getShortestPath(board, currentPosition, targetPosition, movementPoints);
        }

        const isInPath = (pos: Position) => shortestPath.some((p) => p.x === pos.x && p.y === pos.y);

        return board.map((row, y) =>
            row.map((tile, x) => {
                const pos = { x, y };
                return {
                    ...tile,
                    isReachable: isReachable(pos),
                    isInPath: isInPath(pos),
                };
            }),
        );
    }

    getShortestPath(board: BoardTile[][], currentPosition: Position, targetPosition: Position, movementPoints: number): Position[] {
        const visitedPositions = new Set<string>();
        const pathOrigins = new Map<string, Position>();
        const positionCosts = new Map<string, number>();

        const positionKey = (pos: Position) => `${pos.x},${pos.y}`;
        const explorationQueue: { position: Position; cost: number }[] = [{ position: currentPosition, cost: 0 }];

        positionCosts.set(positionKey(currentPosition), 0);

        while (explorationQueue.length > 0) {
            const current = explorationQueue.shift();
            if (!current) break;

            const { position, cost } = current;
            const currentKey = positionKey(position);

            if (visitedPositions.has(currentKey)) continue;
            visitedPositions.add(currentKey);

            if (this.arePositionsEqual(position, targetPosition)) {
                return this.reconstructPath(pathOrigins, currentPosition, targetPosition);
            }

            for (const neighbor of this.getReachableNeighbors(board, position)) {
                const neighborKey = positionKey(neighbor);
                const neighborTile = board[neighbor.y][neighbor.x];
                const moveCost = this.getTileCost(neighborTile.baseTile);
                const totalCost = cost + moveCost;

                if (totalCost > movementPoints) continue;

                const previousCost = positionCosts.get(neighborKey);
                if (previousCost === undefined || totalCost < previousCost) {
                    positionCosts.set(neighborKey, totalCost);
                    pathOrigins.set(neighborKey, position);
                    explorationQueue.push({ position: neighbor, cost: totalCost });
                }
            }
        }

        return [];
    }

    shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private arePositionsEqual(a: Position, b: Position): boolean {
        return a.x === b.x && a.y === b.y;
    }

    private reconstructPath(pathOrigins: Map<string, Position>, start: Position, destination: Position): Position[] {
        const path: Position[] = [];
        let current = destination;
        let currentKey = this.posKey(current);

        while (pathOrigins.has(currentKey)) {
            path.unshift(current);
            const previous = pathOrigins.get(currentKey);
            if (!previous) break;
            current = previous;
            currentKey = this.posKey(current);
        }

        path.unshift(start);
        return path;
    }

    private posKey(pos: Position): string {
        return `${pos.x},${pos.y}`;
    }

    private getReachableNeighbors(board: BoardTile[][], from: Position): Position[] {
        const neighbors: Position[] = [];

        for (const direction of ORTHOGONAL_DIRECTIONS) {
            const nx = from.x + direction.x;
            const ny = from.y + direction.y;

            const tile = board[ny]?.[nx];
            if (!tile) continue;
            if (tile.occupantId) continue;
            if (this.getTileCost(tile.baseTile) === Infinity) continue;

            neighbors.push({ x: nx, y: ny });
        }

        return neighbors;
    }

    private getAvailableItemTypes(containers: ItemContainer[]): ItemType[] {
        return containers
            .filter((container: ItemContainer) => container.item !== ItemType.Random && container.item !== ItemType.SpawnPoint && container.count > 0)
            .reduce<ItemType[]>((acc, container) => {
                for (let i = 0; i < container.count; i++) {
                    acc.push(container.item);
                }
                return acc;
            }, []);
    }

    private replaceRandomItemsInMap(board: Tile[][], availableItems: ItemType[]): void {
        for (const row of board) {
            for (const tile of row) {
                if (tile.item === ItemType.Random) {
                    const item = availableItems.pop();
                    if (item) {
                        tile.item = item;
                    }
                }
            }
        }
    }

    private assignSpawnPoints(board: Tile[][], players: Player[]): void {
        const spawnPositions: Position[] = [];

        for (const [y, row] of board.entries()) {
            for (const [x, tile] of row.entries()) {
                if (tile.item === ItemType.SpawnPoint) {
                    spawnPositions.push({ x, y });
                }
            }
        }

        const selectedSpawns = this.shuffleArray(spawnPositions).slice(0, players.length);

        players.forEach((player, index) => {
            const spawn = selectedSpawns[index];
            player.startingPoint = spawn;
            player.currentPosition = spawn;
        });

        for (const { x, y } of spawnPositions) {
            board[y][x].item = null;
        }
    }
}
