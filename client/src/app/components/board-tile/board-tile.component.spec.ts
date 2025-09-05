import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetsService } from '@app/services/assets/assets.service';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { DiceType } from '@common/enums/dice-type.enum';
import { TileType } from '@common/enums/tile-type.enum';
import { BoardTile } from '@common/interfaces/board-tile.interface';
import { Position } from '@common/interfaces/position.interface';
import { Player } from '@common/models/player.model';
import { BoardTileComponent } from './board-tile.component';

describe('BoardTileComponent', () => {
    let component: BoardTileComponent;
    let fixture: ComponentFixture<BoardTileComponent>;
    let gameSessionService: jasmine.SpyObj<GameSessionService>;
    let assetsService: jasmine.SpyObj<AssetsService>;

    const mockPosition: Position = { x: 0, y: 0 };
    const mockTile: BoardTile = {
        baseTile: {
            type: TileType.Sand,
            item: null,
        },
        isReachable: true,
        isInPath: false,
        occupantId: null,
        isHighlighted: false,
    };

    const mockPlayer: Player = {
        id: '1',
        name: 'Player 1',
        avatar: AvatarName.Avatar1,
        isAdmin: false,
        maxHp: 10,
        currentHp: 10,
        speed: 3,
        attack: 3,
        defense: 3,
        attackDice: DiceType.D4,
        defenseDice: DiceType.D4,
        remainingMoves: 3,
        remainingActions: 1,
        remainingLives: 3,
        combatsWon: 0,
        isActive: false,
        hasAbandoned: false,
        inventory: [],
        startingPoint: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
    };

    beforeEach(async () => {
        gameSessionService = jasmine.createSpyObj('GameSessionService', ['getTileOccupant']);
        assetsService = jasmine.createSpyObj('AssetsService', ['getAvatarStaticImage', 'getTileImage', 'getItemImage']);

        await TestBed.configureTestingModule({
            imports: [BoardTileComponent],
            providers: [
                { provide: GameSessionService, useValue: gameSessionService },
                { provide: AssetsService, useValue: assetsService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BoardTileComponent);
        component = fixture.componentInstance;
        component.tile = { ...mockTile };
        component.position = { ...mockPosition };
        component.isMyTurn = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('occupant', () => {
        it('should get occupant from game session service', () => {
            gameSessionService.getTileOccupant.and.returnValue(mockPlayer);
            expect(component.occupant).toBe(mockPlayer);
            expect(gameSessionService.getTileOccupant).toHaveBeenCalledWith(component.tile);
        });
    });

    describe('images', () => {
        it('should get avatar image URL', () => {
            const expectedUrl = 'path/to/avatar';
            gameSessionService.getTileOccupant.and.returnValue(mockPlayer);
            assetsService.getAvatarStaticImage.and.returnValue(expectedUrl);

            expect(component.avatarImageUrl).toBe(expectedUrl);
            expect(assetsService.getAvatarStaticImage).toHaveBeenCalledWith(mockPlayer.avatar);
        });

        it('should get tile image URL', () => {
            const expectedUrl = 'path/to/tile';
            assetsService.getTileImage.and.returnValue(expectedUrl);

            expect(component.tileImageUrl).toBe(expectedUrl);
            expect(assetsService.getTileImage).toHaveBeenCalledWith(component.tile.baseTile.type, undefined);
        });

        it('should get item image URL', () => {
            const expectedUrl = 'path/to/item';
            assetsService.getItemImage.and.returnValue(expectedUrl);

            expect(component.itemImageUrl).toBe(expectedUrl);
            expect(assetsService.getItemImage).toHaveBeenCalledWith(component.tile.baseTile.item);
        });
    });

    describe('classes', () => {
        it('should return correct classes based on tile state', () => {
            component.tile = {
                ...mockTile,
                isReachable: true,
                isInPath: true,
            };
            component.isMyTurn = true;

            expect(component.classes).toEqual({
                boardTile: true,
                reachable: true,
                inPath: true,
                interactive: true,
            });
        });

        it('should not be interactive when not my turn', () => {
            component.isMyTurn = false;
            expect(component.classes.interactive).toBeFalse();
        });
    });

    describe('event handling', () => {
        it('should emit left click when my turn', () => {
            const spy = spyOn(component.leftClick, 'emit');
            component.isMyTurn = true;
            component.onLeftClick();
            expect(spy).toHaveBeenCalledWith(component.position);
        });

        it('should not emit left click when not my turn', () => {
            const spy = spyOn(component.leftClick, 'emit');
            component.isMyTurn = false;
            component.onLeftClick();
            expect(spy).not.toHaveBeenCalled();
        });

        it('should emit right click with event and position', () => {
            const spy = spyOn(component.rightClick, 'emit');
            const event = new MouseEvent('contextmenu');
            component.onRightClick(event);
            expect(spy).toHaveBeenCalledWith({ event, position: component.position });
        });

        it('should emit hover when my turn', () => {
            const spy = spyOn(component.hover, 'emit');
            component.isMyTurn = true;
            component.onHover();
            expect(spy).toHaveBeenCalledWith(component.position);
        });

        it('should not emit hover when not my turn', () => {
            const spy = spyOn(component.hover, 'emit');
            component.isMyTurn = false;
            component.onHover();
            expect(spy).not.toHaveBeenCalled();
        });

        it('should emit hover out', () => {
            const spy = spyOn(component.hoverOut, 'emit');
            component.onMouseLeave();
            expect(spy).toHaveBeenCalled();
        });
    });
});
