import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CONTEXT_MENU_DELAY } from '@app/constants/game-board.constants';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { PlayerService } from '@app/services/player/player.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { DiceType } from '@common/enums/dice-type.enum';
import { TileType } from '@common/enums/tile-type.enum';
import { BoardTile } from '@common/interfaces/board-tile.interface';
import { Player } from '@common/models/player.model';
import { GameBoardComponent } from './game-board.component';

@Component({
    selector: 'app-board-tile',
    template: '',
})
class MockBoardTileComponent {}

describe('GameBoardComponent', () => {
    let component: GameBoardComponent;
    let fixture: ComponentFixture<GameBoardComponent>;
    let gameSessionService: jasmine.SpyObj<GameSessionService>;
    let playerService: jasmine.SpyObj<PlayerService>;

    const mockBoard = signal<BoardTile[][]>([[]]);
    const mockPosition = { x: 0, y: 0 };
    const mockTile: BoardTile = {
        baseTile: { type: TileType.Sand, item: null },
        occupantId: null,
        isReachable: true,
        isInPath: false,
        isHighlighted: false,
    };

    beforeEach(async () => {
        gameSessionService = jasmine.createSpyObj(
            'GameSessionService',
            ['getTileAt', 'getTileOccupant', 'highlightReachablePathTo', 'clearPathHighlight'],
            {
                board: mockBoard,
            },
        );

        playerService = jasmine.createSpyObj('PlayerService', [], {
            isMyTurn: true,
        });

        await TestBed.configureTestingModule({
            imports: [GameBoardComponent],
            declarations: [MockBoardTileComponent],
            providers: [
                { provide: GameSessionService, useValue: gameSessionService },
                { provide: PlayerService, useValue: playerService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get board from game session service', () => {
        expect(component.board).toBe(mockBoard);
    });

    it('should get turn status from player service', () => {
        expect(component.isMyTurn).toBe(true);
    });

    describe('onLeftClick', () => {
        it('should do nothing if not player turn', () => {
            Object.defineProperty(playerService, 'isMyTurn', { get: () => false });
            component.onLeftClick(mockPosition);
            expect(gameSessionService.getTileAt).not.toHaveBeenCalled();
        });

        it('should do nothing if tile is not reachable', () => {
            const unreachableTile = { ...mockTile, isReachable: false };
            gameSessionService.getTileAt.and.returnValue(unreachableTile);
            component.onLeftClick(mockPosition);
        });
    });

    describe('onRightClick', () => {
        it('should show player info in context menu', fakeAsync(() => {
            const mockPlayer: Player = {
                id: 'player1',
                name: 'Player 1',
                avatar: AvatarName.Avatar1,
                isAdmin: false,
                maxHp: 10,
                currentHp: 10,
                attack: 1,
                defense: 1,
                speed: 1,
                remainingMoves: 1,
                remainingActions: 1,
                remainingLives: 1,
                combatsWon: 0,
                isActive: true,
                hasAbandoned: false,
                startingPoint: { x: 0, y: 0 },
                currentPosition: { x: 0, y: 0 },
                attackDice: DiceType.D4,
                defenseDice: DiceType.D4,
                inventory: [],
            };
            const event = { preventDefault: jasmine.createSpy(), clientX: 100, clientY: 100 } as unknown as MouseEvent;

            gameSessionService.getTileAt.and.returnValue(mockTile);
            gameSessionService.getTileOccupant.and.returnValue(mockPlayer);

            component.onRightClick(event, mockPosition);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component['contextMenuText']).toBe('Joueur: Player 1');
            expect(component['contextMenuPosition']).toEqual({ x: 100, y: 100 });

            tick(CONTEXT_MENU_DELAY);
            expect(component['contextMenuText']).toBeNull();
            expect(component['contextMenuPosition']).toBeNull();
        }));

        it('should show movement cost in context menu', fakeAsync(() => {
            const event = { preventDefault: jasmine.createSpy(), clientX: 100, clientY: 100 } as unknown as MouseEvent;

            gameSessionService.getTileAt.and.returnValue(mockTile);
            gameSessionService.getTileOccupant.and.returnValue(null);

            component.onRightClick(event, mockPosition);

            expect(component['contextMenuText']).toMatch(/Coût de déplacement: \d+/);

            tick(CONTEXT_MENU_DELAY);
            expect(component['contextMenuText']).toBeNull();
        }));
    });

    describe('hover behavior', () => {
        it('should highlight path on hover of reachable tile', () => {
            gameSessionService.getTileAt.and.returnValue(mockTile);
            component.onHover(mockPosition);
            expect(gameSessionService.highlightReachablePathTo).toHaveBeenCalledWith(mockPosition);
        });

        it('should not highlight path if not player turn', () => {
            Object.defineProperty(playerService, 'isMyTurn', { get: () => false });
            component.onHover(mockPosition);
            expect(gameSessionService.highlightReachablePathTo).not.toHaveBeenCalled();
        });

        it('should clear path highlight on hover out', () => {
            component.onHoverOut();
            expect(gameSessionService.clearPathHighlight).toHaveBeenCalled();
        });
    });

    it('should track by index', () => {
        expect(component.trackByIndex(5)).toBe(5);
    });
});
