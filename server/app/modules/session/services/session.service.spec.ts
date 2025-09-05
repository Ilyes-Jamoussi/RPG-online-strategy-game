import { Session, SessionDocument } from '@app/modules/session/models/session.schema';
import { CreateSessionDto } from '@common/dto/session/create-session.dto';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { MapSize } from '@common/enums/map-size.enum';
import { Player } from '@common/models/player.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { SessionService } from './session.service';
import { DiceType } from '@common/enums/dice-type.enum';

describe('SessionService', () => {
    let service: SessionService;
    let sessionModel: Model<SessionDocument>;

    const mockPlayer: Player = {
        id: 'player1',
        name: 'Test Player',
        avatar: AvatarName.Avatar1,
        isAdmin: true,

        maxHp: 100,
        currentHp: 100,
        speed: 1,
        attack: 1,
        defense: 1,

        attackDice: DiceType.D6,
        defenseDice: DiceType.D4,

        remainingMoves: 1,
        remainingActions: 1,
        remainingLives: 3,

        combatsWon: 0,
        isActive: false,
        hasAbandoned: false,
        inventory: [],

        startingPoint: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
    };

    const mockSession = {
        _id: new Types.ObjectId(),
        mapSize: MapSize.Small,
        players: [mockPlayer],
        map: [],
        itemContainers: [],
        activePlayerId: mockPlayer.id,
        isGameStarted: false,
        turnStartTime: new Date(),
    };

    const mockCreateSessionDto: CreateSessionDto = {
        mapSize: MapSize.Small,
        player: mockPlayer,
        map: [],
        itemContainers: [],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionService,
                {
                    provide: getModelToken('Session'),
                    useValue: {
                        find: jest.fn().mockResolvedValue([]),
                        findById: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue({}),
                    },
                },
            ],
        }).compile();

        service = module.get<SessionService>(SessionService);
        sessionModel = module.get<Model<SessionDocument>>(getModelToken(Session.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have required methods', () => {
        expect(typeof service.createSession).toBe('function');
    });

    it('should return true', () => {
        expect(true).toBe(true);
    });

    describe('createSession', () => {
        it('should create a new session', async () => {
            (sessionModel.create as jest.Mock).mockResolvedValue(mockSession);

            const result = await service.createSession(mockCreateSessionDto.mapSize, mockPlayer);
            expect(result).toEqual(mockSession);
            expect(sessionModel.create).toHaveBeenCalledWith({
                ...mockCreateSessionDto,
                activePlayerId: mockPlayer.id,
                isGameStarted: false,
                turnStartTime: expect.any(Date),
            });
        });

        it('should handle creation failure', async () => {
            (sessionModel.create as jest.Mock).mockRejectedValue(new Error('Creation failed'));
            await expect(service.createSession(mockCreateSessionDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('getSession', () => {
        it('should return a session by id', async () => {
            (sessionModel.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockSession),
            });

            const result = await service.getSession(mockSession._id.toHexString());
            expect(result).toEqual(mockSession);
        });

        it('should throw NotFoundException if session not found', async () => {
            (sessionModel.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.getSession('nonexistent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('addPlayer', () => {
        const newPlayer: Player = {
            id: 'player2',
            name: 'New Player',
            avatar: AvatarName.Avatar2,
            isAdmin: false,
            currentPosition: { x: 1, y: 1 },
            startingPoint: { x: 1, y: 1 },
        };

        it('should add a player to the session', async () => {
            const updatedSession = {
                ...mockSession,
                players: [...mockSession.players, newPlayer],
            };

            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(updatedSession),
            });

            const result = await service.addPlayer(mockSession._id.toHexString(), newPlayer);
            expect(result.players).toContainEqual(newPlayer);
        });

        it('should throw NotFoundException if session not found', async () => {
            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.addPlayer('nonexistent-id', newPlayer)).rejects.toThrow(NotFoundException);
        });
    });

    describe('removePlayer', () => {
        it('should remove a player from the session', async () => {
            const updatedSession = {
                ...mockSession,
                players: [],
            };

            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(updatedSession),
            });

            const result = await service.removePlayer(mockSession._id.toHexString(), mockPlayer.id);
            expect(result.players).not.toContainEqual(mockPlayer);
        });

        it('should throw NotFoundException if session not found', async () => {
            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.removePlayer('nonexistent-id', mockPlayer.id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('startGame', () => {
        it('should start the game session', async () => {
            const updatedSession = {
                ...mockSession,
                isGameStarted: true,
            };

            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(updatedSession),
            });

            const result = await service.startGame(mockSession._id.toHexString());
            expect(result.isGameStarted).toBe(true);
        });

        it('should throw NotFoundException if session not found', async () => {
            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.startGame('nonexistent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTurnStartTime', () => {
        it('should update the turn start time', async () => {
            const newTime = new Date();
            const updatedSession = {
                ...mockSession,
                turnStartTime: newTime,
            };

            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(updatedSession),
            });

            const result = await service.updateTurnStartTime(mockSession._id.toHexString(), newTime);
            expect(result.turnStartTime).toEqual(newTime);
        });

        it('should throw NotFoundException if session not found', async () => {
            (sessionModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            await expect(service.updateTurnStartTime('nonexistent-id', new Date())).rejects.toThrow(NotFoundException);
        });
    });
});
