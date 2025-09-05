import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetsService } from '@app/services/assets/assets.service';
import { PlayerService } from '@app/services/player/player.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { DiceType } from '@common/enums/dice-type.enum';
import { CharacterAttributesPanelComponent } from './character-attributes-panel.component';

describe('CharacterAttributesPanelComponent', () => {
    let component: CharacterAttributesPanelComponent;
    let fixture: ComponentFixture<CharacterAttributesPanelComponent>;
    let playerService: jasmine.SpyObj<PlayerService>;
    let assetsService: jasmine.SpyObj<AssetsService>;

    beforeEach(async () => {
        playerService = jasmine.createSpyObj('PlayerService', ['updatePlayer', 'player']);
        playerService.player.and.returnValue({
            attackDice: DiceType.D4,
            defenseDice: DiceType.D4,
            id: '1',
            name: 'Player 1',
            avatar: AvatarName.Avatar1,
            isAdmin: false,
            maxHp: 10,
            currentHp: 10,
            speed: 3,
            attack: 3,
            defense: 3,
            remainingMoves: 3,
            remainingActions: 1,
            remainingLives: 3,
            combatsWon: 0,
            isActive: true,
            hasAbandoned: false,
            inventory: [],
            startingPoint: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
        });
        assetsService = jasmine.createSpyObj('AssetsService', ['getDiceImage']);

        await TestBed.configureTestingModule({
            imports: [CharacterAttributesPanelComponent],
            providers: [
                { provide: PlayerService, useValue: playerService },
                { provide: AssetsService, useValue: assetsService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CharacterAttributesPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit when validated', () => {
        const spy = spyOn(component.validated, 'emit');
        component.onValidate();
        expect(spy).toHaveBeenCalled();
    });

    it('should update character name', () => {
        const name = 'Test Name';
        component.updateCharacterName(name);
        expect(playerService.updatePlayer).toHaveBeenCalledWith({ name });
    });

    describe('attribute values', () => {
        it('should return base value for non-bonus attributes', () => {
            expect(component.getAttributeValue('attack')).toBe(component.baseValue);
            expect(component.getAttributeValue('defense')).toBe(component.baseValue);
        });

        it('should return base value for unselected bonus attributes', () => {
            expect(component.getAttributeValue('maxHp')).toBe(component.baseValue);
            expect(component.getAttributeValue('speed')).toBe(component.baseValue);
        });

        it('should return bonus value for selected maxHp', () => {
            component.selectBonus('maxHp');
            expect(component.getAttributeValue('maxHp')).toBe(component.baseValue + component.bonusValue);
        });

        it('should return bonus value for selected speed', () => {
            component.selectBonus('speed');
            expect(component.getAttributeValue('speed')).toBe(component.baseValue + component.bonusValue);
        });
    });

    describe('bonus selection', () => {
        it('should select bonus attribute', () => {
            component.selectBonus('maxHp');
            expect(component.isBonusSelected('maxHp')).toBeTrue();
            expect(component.isBonusSelected('speed')).toBeFalse();
        });

        it('should unselect bonus attribute when selected again', () => {
            component.selectBonus('maxHp');
            component.selectBonus('maxHp');
            expect(component.isBonusSelected('maxHp')).toBeFalse();
        });

        it('should switch bonus attribute', () => {
            component.selectBonus('maxHp');
            component.selectBonus('speed');
            expect(component.isBonusSelected('maxHp')).toBeFalse();
            expect(component.isBonusSelected('speed')).toBeTrue();
        });

        it('should update player stats when selecting maxHp', () => {
            component.selectBonus('maxHp');
            expect(playerService.updatePlayer).toHaveBeenCalledWith({
                maxHp: component.baseValue + component.bonusValue,
                currentHp: component.baseValue + component.bonusValue,
            });
        });

        it('should update player stats when selecting speed', () => {
            component.selectBonus('speed');
            expect(playerService.updatePlayer).toHaveBeenCalledWith({
                speed: component.baseValue + component.bonusValue,
            });
        });
    });

    describe('dice selection', () => {
        it('should toggle attack dice', () => {
            component.selectDice('attackDice');
            expect(playerService.updatePlayer).toHaveBeenCalledWith({
                attackDice: DiceType.D6,
                defenseDice: DiceType.D4,
            });
        });

        it('should toggle defense dice', () => {
            component.selectDice('defenseDice');
            expect(playerService.updatePlayer).toHaveBeenCalledWith({
                attackDice: DiceType.D4,
                defenseDice: DiceType.D6,
            });
        });

        it('should check if dice is selected', () => {
            playerService.player.and.returnValue({
                ...playerService.player(),
                attackDice: DiceType.D6,
                defenseDice: DiceType.D4,
            });
            expect(component.isDiceSelected('attackDice')).toBeTrue();
            expect(component.isDiceSelected('defenseDice')).toBeFalse();
        });
    });

    it('should get dice image', () => {
        const expectedPath = 'path/to/dice';
        assetsService.getDiceImage.and.returnValue(expectedPath);
        expect(component.getDiceImage(DiceType.D6)).toBe(expectedPath);
        expect(assetsService.getDiceImage).toHaveBeenCalledWith(DiceType.D6);
    });
});
