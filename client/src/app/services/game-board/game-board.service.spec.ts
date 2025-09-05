import { TestBed } from '@angular/core/testing';
import { DOOR_MOVEMENT_COST, TILE_MOVEMENT_COST } from '@app/constants/game-board.constants';
import { ItemType } from '@common/enums/item-type.enum';
import { DoorState, TileType } from '@common/enums/tile-type.enum';
import { BoardTile } from '@common/interfaces/board-tile.interface';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Position } from '@common/interfaces/position.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { Player } from '@common/models/player.model';
import { GameBoardService } from './game-board.service';

describe('GameBoardService', () => {
    let service: GameBoardService;

    // Constants pour les tests
    const BOARD_SIZE = 3;
    const SMALL_BOARD_SIZE = 2;
    const CENTER_POSITION = 1;
    const MOVEMENT_POINTS = 1;
    const EXTENDED_MOVEMENT_POINTS = 2;
    const EXPECTED_ADJACENT_TILES = 4;
    const TOTAL_REACHABLE_TILES = EXPECTED_ADJACENT_TILES + 1; // Centre + tuiles adjacentes
    const BLOCKED_ADJACENT_TILES = 3; // Une tuile bloquée
    const CORNER_REACHABLE_TILES = 3; // Position de coin + 2 tuiles adjacentes

    const mockTile: Tile = {
        type: TileType.Sand,
        item: null,
    };

    const mockBoardTile: BoardTile = {
        baseTile: mockTile,
        occupantId: null,
        isReachable: false,
        isInPath: false,
        isHighlighted: false,
    };

    const mockPlayer: Player = {
        id: '1',
        name: 'Player 1',
        startingPoint: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
    } as Player;

    const createMockBoard = (size: number): BoardTile[][] => {
        return Array(size)
            .fill(null)
            .map(() =>
                Array(size)
                    .fill(null)
                    .map(() => ({ ...mockBoardTile })),
            );
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameBoardService],
        });
        service = TestBed.inject(GameBoardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getTileCost', () => {
        it('should return correct cost for regular tile', () => {
            const tile: Tile = { type: TileType.Sand, item: null };
            expect(service.getTileCost(tile)).toBe(TILE_MOVEMENT_COST[TileType.Sand]);
        });

        it('should return correct cost for door with state', () => {
            const tile: Tile = { type: TileType.Door, item: null, doorState: DoorState.Open };
            expect(service.getTileCost(tile)).toBe(DOOR_MOVEMENT_COST[DoorState.Open]);
        });

        it('should return cost for closed door when no state specified', () => {
            const tile: Tile = { type: TileType.Door, item: null };
            expect(service.getTileCost(tile)).toBe(DOOR_MOVEMENT_COST[DoorState.Closed]);
        });
    });

    describe('getReachableTiles', () => {
        it('should return only starting position when no movement points', () => {
            const board = createMockBoard(BOARD_SIZE);
            const position: Position = { x: CENTER_POSITION, y: CENTER_POSITION };
            const reachable = service.getReachableTiles(board, position, 0);
            expect(reachable).toEqual([position]);
        });

        it('should return orthogonally adjacent tiles within movement points', () => {
            const board = createMockBoard(BOARD_SIZE);
            const position: Position = { x: CENTER_POSITION, y: CENTER_POSITION };
            const reachable = service.getReachableTiles(board, position, MOVEMENT_POINTS);
            expect(reachable.length).toBe(TOTAL_REACHABLE_TILES);
        });

        it('should not include tiles with occupants', () => {
            const board = createMockBoard(BOARD_SIZE);
            board[CENTER_POSITION][CENTER_POSITION + 1].occupantId = '2';
            const position: Position = { x: CENTER_POSITION, y: CENTER_POSITION };
            const reachable = service.getReachableTiles(board, position, MOVEMENT_POINTS);
            expect(reachable.length).toBe(BLOCKED_ADJACENT_TILES + 1);
        });

        it('should not include tiles beyond board boundaries', () => {
            const board = createMockBoard(SMALL_BOARD_SIZE);
            const position: Position = { x: 0, y: 0 };
            const reachable = service.getReachableTiles(board, position, MOVEMENT_POINTS);
            expect(reachable.length).toBe(CORNER_REACHABLE_TILES);
        });
    });

    describe('highlightReachableAndPath', () => {
        it('should highlight reachable tiles', () => {
            const board = createMockBoard(BOARD_SIZE);
            const position: Position = { x: CENTER_POSITION, y: CENTER_POSITION };
            const result = service.highlightReachableAndPath(board, position, MOVEMENT_POINTS);

            expect(result[CENTER_POSITION][CENTER_POSITION].isReachable).toBeTrue(); // Center
            expect(result[0][CENTER_POSITION].isReachable).toBeTrue(); // North
            expect(result[CENTER_POSITION][0].isReachable).toBeTrue(); // West
            expect(result[CENTER_POSITION][CENTER_POSITION + 1].isReachable).toBeTrue(); // East
            expect(result[CENTER_POSITION + 1][CENTER_POSITION].isReachable).toBeTrue(); // South
        });

        it('should highlight path to target if reachable', () => {
            const board = createMockBoard(BOARD_SIZE);
            const start: Position = { x: 0, y: 0 };
            const target: Position = { x: CENTER_POSITION, y: CENTER_POSITION };
            const result = service.highlightReachableAndPath(board, start, EXTENDED_MOVEMENT_POINTS, target);

            expect(result[0][0].isInPath).toBeTrue(); // Start
            expect(result[0][CENTER_POSITION].isInPath).toBeTrue(); // Step
            expect(result[CENTER_POSITION][CENTER_POSITION].isInPath).toBeTrue(); // Target
        });

        it('should not highlight path if target is unreachable', () => {
            const board = createMockBoard(BOARD_SIZE);
            const start: Position = { x: 0, y: 0 };
            const target: Position = { x: CENTER_POSITION + 1, y: CENTER_POSITION + 1 };
            const result = service.highlightReachableAndPath(board, start, MOVEMENT_POINTS, target);

            expect(result.some((row) => row.some((tile) => tile.isInPath))).toBeFalse();
        });
    });

    describe('prepareGameBoard', () => {
        const mockMap: Tile[][] = [
            [
                { type: TileType.Sand, item: ItemType.Random },
                { type: TileType.Sand, item: null },
            ],
            [
                { type: TileType.Sand, item: null },
                { type: TileType.Sand, item: ItemType.SpawnPoint },
            ],
        ];

        const mockContainers: ItemContainer[] = [
            { item: ItemType.CriticalHealthAttackBoost, count: 1 },
            { item: ItemType.Random, count: 1 },
            { item: ItemType.SpawnPoint, count: 1 },
        ];

        it('should create board with correct dimensions', () => {
            const result = service.prepareGameBoard(mockMap, mockContainers, [mockPlayer]);
            expect(result.length).toBe(mockMap.length);
            expect(result[0].length).toBe(mockMap[0].length);
        });

        it('should assign player spawn points', () => {
            const result = service.prepareGameBoard(mockMap, mockContainers, [mockPlayer]);
            const playerTile = result[mockPlayer.startingPoint.y][mockPlayer.startingPoint.x];
            expect(playerTile.occupantId).toBe(mockPlayer.id);
        });

        it('should initialize tiles with default values', () => {
            const result = service.prepareGameBoard(mockMap, mockContainers, [mockPlayer]);
            result.forEach((row) => {
                row.forEach((tile) => {
                    expect(tile.isReachable).toBeFalse();
                    expect(tile.isInPath).toBeFalse();
                    expect(tile.isHighlighted).toBeFalse();
                });
            });
        });
    });
});
