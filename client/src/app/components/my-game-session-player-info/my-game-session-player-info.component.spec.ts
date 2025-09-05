import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AssetsService } from '@app/services/assets/assets.service';
import { PlayerService } from '@app/services/player/player.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { DiceType } from '@common/enums/dice-type.enum';
import { Player } from '@common/models/player.model';
import { MyGameSessionPlayerInfoComponent } from './my-game-session-player-info.component';

const PERCENTAGE_FULL = 100;
const CURRENT_HEALTH = 8;
const MAX_HEALTH = 10;
const EXPECTED_HEALTH_PERCENTAGE = (CURRENT_HEALTH / MAX_HEALTH) * PERCENTAGE_FULL;

describe('MyGameSessionPlayerInfoComponent', () => {
    let component: MyGameSessionPlayerInfoComponent;
    let fixture: ComponentFixture<MyGameSessionPlayerInfoComponent>;
    let assetsService: jasmine.SpyObj<AssetsService>;
    let playerService: jasmine.SpyObj<PlayerService>;

    const mockPlayer: Player = {
        id: '1',
        name: 'Test Player',
        avatar: AvatarName.Avatar1,
        isAdmin: false,
        maxHp: MAX_HEALTH,
        currentHp: CURRENT_HEALTH,
        speed: 3,
        attack: 4,
        defense: 5,
        attackDice: DiceType.D4,
        defenseDice: DiceType.D6,
        remainingMoves: 2,
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
        assetsService = jasmine.createSpyObj('AssetsService', ['getAvatarStaticImage', 'getDiceImage']);
        playerService = jasmine.createSpyObj('PlayerService', [], {
            player: signal(mockPlayer),
        });

        assetsService.getAvatarStaticImage.and.returnValue('/assets/mock-avatar.png');
        assetsService.getDiceImage.and.returnValue('/assets/mock-dice.png');

        await TestBed.configureTestingModule({
            imports: [MyGameSessionPlayerInfoComponent],
            providers: [
                { provide: AssetsService, useValue: assetsService },
                { provide: PlayerService, useValue: playerService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MyGameSessionPlayerInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display player name', () => {
        const nameElement = fixture.debugElement.query(By.css('.player-name'));
        expect(nameElement.nativeElement.textContent).toBe(mockPlayer.name);
    });

    it('should calculate health percentage correctly', () => {
        // @ts-ignore - Accessing protected method for testing
        const healthPercentage = component.healthPercentage;
        expect(healthPercentage).toBe(EXPECTED_HEALTH_PERCENTAGE);
    });

    it('should display current and max HP', () => {
        const healthText = fixture.debugElement.query(By.css('.health-text'));
        expect(healthText.nativeElement.textContent).toBe(`${mockPlayer.currentHp} / ${mockPlayer.maxHp} PV`);
    });

    it('should display stats correctly', () => {
        const statValues = fixture.debugElement.queryAll(By.css('.stat-value'));
        expect(statValues[0].nativeElement.textContent).toBe(mockPlayer.speed.toString());
        expect(statValues[1].nativeElement.textContent).toBe(mockPlayer.attack.toString());
        expect(statValues[2].nativeElement.textContent).toBe(mockPlayer.defense.toString());
    });

    it('should display remaining moves and actions', () => {
        const actionValues = fixture.debugElement.queryAll(By.css('.action-value'));
        expect(actionValues[0].nativeElement.textContent).toBe(mockPlayer.remainingMoves.toString());
        expect(actionValues[1].nativeElement.textContent).toBe(mockPlayer.remainingActions.toString());
    });

    it('should call getAvatarUrl with correct avatar', () => {
        expect(assetsService.getAvatarStaticImage).toHaveBeenCalledWith(mockPlayer.avatar);
    });

    it('should call getDiceImage with correct dice types', () => {
        expect(assetsService.getDiceImage).toHaveBeenCalledWith(mockPlayer.attackDice);
        expect(assetsService.getDiceImage).toHaveBeenCalledWith(mockPlayer.defenseDice);
    });

    it('should set health bar width based on health percentage', () => {
        const healthBarFill = fixture.debugElement.query(By.css('.health-bar-fill'));
        expect(healthBarFill.styles['width']).toBe(`${EXPECTED_HEALTH_PERCENTAGE}%`);
    });
});
