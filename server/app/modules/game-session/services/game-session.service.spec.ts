import { CreateGameSessionDto } from '@common/dto/game-session/create-game-session.dto';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { ItemType } from '@common/enums/item-type.enum';
import { MapSize } from '@common/enums/map-size.enum';
import { TileType } from '@common/enums/tile-type.enum';
import { Player } from '@common/models/player.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { GameSession, GameSessionDocument } from '../models/game-session.schema';
import { GameSessionService } from './game-session.service';

describe('GameSessionService', () => {
    let service: GameSessionService;
    let gameSessionModel: Model<GameSessionDocument>;

    const mockPlayer: Player = {
        id: 'player1',
        name: 'Test Player',
        avatar: AvatarName.Avatar1,
        isAdmin: true,
        maxHp: 100,
        currentHp: 100,
        speed: 3,
        attack: 10,
        defense: 5,
        currentPosition: { x: 0, y: 0 },
        startingPoint: { x: 0, y: 0 },
        inventory: [],
        effects: [],
        isPlaying: true,
        hasCompletedTurn: false,
    };

    const mockGameSession = {
        _id: new Types.ObjectId(),
        mapSize: MapSize.Small,
        players: [mockPlayer],
        map: [[{ type: TileType.Sand, item: null }], [{ type: TileType.Sand, item: ItemType.HealthAndDefenseBoost }]],
        itemContainers: [
            { item: ItemType.HealthAndDefenseBoost, count: 1 },
            { item: ItemType.SpeedAndAttackBoost, count: 1 },
        ],
        activePlayerId: mockPlayer.id,
        isGameStarted: false,
        turnStartTime: new Date(),
    };

    const mockCreateGameSessionDto: CreateGameSessionDto = {
        mapSize: MapSize.Small,
        player: mockPlayer,
        map: mockGameSession.map,
        itemContainers: mockGameSession.itemContainers,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameSessionService,
                {
                    provide: getModelToken(GameSession.name),
                    useValue: {
                        findById: jest.fn(),
                        create: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<GameSessionService>(GameSessionService);
        gameSessionModel = module.get<Model<GameSessionDocument>>(getModelToken(GameSession.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createGameSession', () => {
        it('should create a new game session', async () => {
            (gameSessionModel.create as jest.Mock).mockResolvedValue(mockGameSession);

            const result = await service.createGameSession(mockCreateGameSessionDto);
            expect(result).toEqual(mockGameSession);
            expect(gameSessionModel.create).toHaveBeenCalledWith({
                ...mockCreateGameSessionDto,
                activePlayerId: mockPlayer.id,
                isGameStarted: false,
                turnStartTime: expect.any(Date),
            });
        });

        it('should handle creation failure', async () => {
            (gameSessionModel.create as jest.Mock).mockRejectedValue(new Error('Creation failed'));
            await expect(service.createGameSession(mockCreateGameSessionDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findGameSession', () => {
        it('should return a game session by id', async () => {
            (gameSessionModel.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockGameSession),
            });

            const result = await service.findGameSession(mockGameSession._id.toHexString());
            expect(result).toEqual(mockGameSession);
        });

        it('should throw NotFoundException if game session not found', async () => {
            (gameSessionModel.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findGameSession('nonexistent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('updatePlayerPosition', () => {
        it('should update player position', async () => {
            const newPosition = { x: 1, y: 1 };
            const updatedPlayer = { ...mockPlayer, currentPosition: newPosition };
            const updatedSession = {
                ...mockGameSession,
                players: [updatedPlayer],
            };

            (gameSessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(updatedSession),
            });

            const result = await service.updatePlayerPosition(mockGameSession._id.toHexString(), mockPlayer.id, newPosition);
            expect(result.players[0].currentPosition).toEqual(newPosition);
        });

        it('should throw NotFoundException if game session not found', async () => {
            (gameSessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.updatePlayerPosition('nonexistent-id', mockPlayer.id, { x: 1, y: 1 })).rejects.toThrow(NotFoundException);
        });
    });

    describe('pickupItem', () => {
        it('should allow player to pick up an item', async () => {
            const itemPosition = { x: 1, y: 0 };
            const updatedPlayer = {
                ...mockPlayer,
                inventory: [ItemType.HealthAndDefenseBoost],
            };
            const updatedMap = [[{ type: TileType.Sand, item: null }], [{ type: TileType.Sand, item: null }]];
            const updatedSession = {
                ...mockGameSession,
                players: [updatedPlayer],
                map: updatedMap,
            };

            (gameSessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(updatedSession),
            });

            const result = await service.pickupItem(mockGameSession._id.toHexString(), mockPlayer.id, itemPosition);
            expect(result.players[0].inventory).toContain(ItemType.HealthAndDefenseBoost);
            expect(result.map[itemPosition.y][itemPosition.x].item).toBeNull();
        });

        it('should throw NotFoundException if game session not found', async () => {
            (gameSessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.pickupItem('nonexistent-id', mockPlayer.id, { x: 1, y: 0 })).rejects.toThrow(NotFoundException);
        });
    });

    describe('endTurn', () => {
        it('should end current player turn and update active player', async () => {
            const updatedSession = {
                ...mockGameSession,
                players: [{ ...mockPlayer, hasCompletedTurn: true }],
            };

            (gameSessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(updatedSession),
            });

            const result = await service.endTurn(mockGameSession._id.toHexString(), mockPlayer.id);
            expect(result.players[0].hasCompletedTurn).toBe(true);
        });

        it('should throw NotFoundException if game session not found', async () => {
            (gameSessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.endTurn('nonexistent-id', mockPlayer.id)).rejects.toThrow(NotFoundException);
        });
    });
});
