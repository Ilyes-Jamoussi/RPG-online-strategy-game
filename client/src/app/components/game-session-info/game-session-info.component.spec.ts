import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { MapSize } from '@common/enums/map-size.enum';
import { GameSessionInfoComponent } from './game-session-info.component';

describe('GameSessionInfoComponent', () => {
    let component: GameSessionInfoComponent;
    let fixture: ComponentFixture<GameSessionInfoComponent>;
    let gameSessionService: jasmine.SpyObj<GameSessionService>;

    const MOCK_PLAYERS_COUNT = 4;
    const mockPlayer = {
        id: '1',
        name: 'Test Player',
        isAdmin: false,
        maxHp: 10,
        currentHp: 10,
        speed: 3,
        attack: 3,
        defense: 3,
        attackDice: 'D4',
        defenseDice: 'D4',
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
        gameSessionService = jasmine.createSpyObj('GameSessionService', [], {
            activePlayer: signal(mockPlayer),
            playersCount: signal(MOCK_PLAYERS_COUNT),
            mapSize: MapSize.Small,
        });

        await TestBed.configureTestingModule({
            imports: [GameSessionInfoComponent, MatIconModule],
            providers: [{ provide: GameSessionService, useValue: gameSessionService }],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSessionInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display map size correctly', () => {
        const mapSizeElement = fixture.debugElement.query(By.css('.info-value'));
        expect(mapSizeElement.nativeElement.textContent.trim()).toBe(`${MapSize.Small}x${MapSize.Small}`);
    });

    it('should display players count correctly', () => {
        const playersCountElement = fixture.debugElement.queryAll(By.css('.info-value'))[1];
        expect(playersCountElement.nativeElement.textContent.trim()).toBe(MOCK_PLAYERS_COUNT.toString());
    });

    it('should display active player name when available', () => {
        const activePlayerElement = fixture.debugElement.query(By.css('.info-value.active'));
        expect(activePlayerElement.nativeElement.textContent.trim()).toBe(mockPlayer.name);
    });

    it('should not display active player card when no active player', () => {
        // @ts-ignore - Accessing private property for testing
        gameSessionService.activePlayer = signal(null);
        fixture.detectChanges();

        const activePlayerCard = fixture.debugElement.query(By.css('.active-player-card'));
        expect(activePlayerCard).toBeFalsy();
    });
});
