import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { AssetsService } from '@app/services/assets/assets.service';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { DiceType } from '@common/enums/dice-type.enum';
import { Player } from '@common/models/player.model';
import { GameSessionPlayersComponent } from './game-session-players.component';

describe('GameSessionPlayersComponent', () => {
    let component: GameSessionPlayersComponent;
    let fixture: ComponentFixture<GameSessionPlayersComponent>;
    let assetsService: jasmine.SpyObj<AssetsService>;
    let gameSessionService: jasmine.SpyObj<GameSessionService>;

    const mockPlayers: Player[] = [
        {
            id: '1',
            name: 'Player 1',
            avatar: AvatarName.Avatar1,
            isAdmin: true,
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
            combatsWon: 2,
            isActive: true,
            hasAbandoned: false,
            inventory: [],
            startingPoint: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
        },
        {
            id: '2',
            name: 'Player 2',
            avatar: AvatarName.Avatar2,
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
            combatsWon: 1,
            isActive: false,
            hasAbandoned: true,
            inventory: [],
            startingPoint: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
        },
    ];

    beforeEach(async () => {
        assetsService = jasmine.createSpyObj('AssetsService', ['getAvatarStaticImage']);
        gameSessionService = jasmine.createSpyObj('GameSessionService', [], {
            players: signal(mockPlayers),
        });

        assetsService.getAvatarStaticImage.and.returnValue('/assets/mock-avatar.png');

        await TestBed.configureTestingModule({
            imports: [GameSessionPlayersComponent, MatIconModule],
            providers: [
                { provide: AssetsService, useValue: assetsService },
                { provide: GameSessionService, useValue: gameSessionService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSessionPlayersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display all players', () => {
        const playerElements = fixture.debugElement.queryAll(By.css('.player-item'));
        expect(playerElements.length).toBe(mockPlayers.length);
    });

    it('should display player names correctly', () => {
        const playerNames = fixture.debugElement.queryAll(By.css('.player-name'));
        expect(playerNames[0].nativeElement.textContent).toBe(mockPlayers[0].name);
        expect(playerNames[1].nativeElement.textContent).toBe(mockPlayers[1].name);
    });

    it('should show admin badge for admin player', () => {
        const adminBadge = fixture.debugElement.query(By.css('.admin-badge'));
        expect(adminBadge).toBeTruthy();
    });

    it('should show active badge for active player', () => {
        const activeBadge = fixture.debugElement.query(By.css('.active-badge'));
        expect(activeBadge).toBeTruthy();
        expect(activeBadge.nativeElement.textContent).toContain('Tour actif');
    });

    it('should apply abandoned class for abandoned player', () => {
        const abandonedPlayer = fixture.debugElement.queryAll(By.css('.player-item'))[1];
        expect(abandonedPlayer.classes['abandoned']).toBeTruthy();
    });

    it('should display correct number of combats won', () => {
        const playerStats = fixture.debugElement.queryAll(By.css('.player-stats'));
        expect(playerStats[0].nativeElement.textContent).toContain('2 combats gagnés');
        expect(playerStats[1].nativeElement.textContent).toContain('1 combat gagné');
    });

    it('should call getAvatarUrl with correct avatar', () => {
        expect(assetsService.getAvatarStaticImage).toHaveBeenCalledWith(mockPlayers[0].avatar);
        expect(assetsService.getAvatarStaticImage).toHaveBeenCalledWith(mockPlayers[1].avatar);
    });

    it('should use trackByPlayerId correctly', () => {
        const player = mockPlayers[0];
        // @ts-ignore - Accessing protected method for testing
        const trackByResult = component.trackByPlayerId(0, player);
        expect(trackByResult).toBe(player.id);
    });
});
