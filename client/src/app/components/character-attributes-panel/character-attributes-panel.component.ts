import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BASE_STAT, BONUS_STAT } from '@app/constants/player.constants';
import { AssetsService } from '@app/services/assets/assets.service';
import { PlayerService } from '@app/services/player/player.service';
import { DiceType } from '@common/enums/dice-type.enum';

type AttributeKey = 'maxHp' | 'speed' | 'attack' | 'defense';
type BonusAttributeKey = 'maxHp' | 'speed';

@Component({
    selector: 'app-character-attributes-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './character-attributes-panel.component.html',
    styleUrls: ['./character-attributes-panel.component.scss'],
})
export class CharacterAttributesPanelComponent {
    @Output() validated = new EventEmitter<void>();
    readonly diceType = DiceType;
    readonly baseValue = BASE_STAT;
    readonly bonusValue = BONUS_STAT;
    private selectedBonus: BonusAttributeKey | null = null;

    constructor(
        readonly playerService: PlayerService,
        private readonly assetsService: AssetsService,
    ) {}

    onValidate(): void {
        this.validated.emit();
    }

    updateCharacterName(name: string): void {
        this.playerService.updatePlayer({ name });
    }

    getAttributeValue(key: AttributeKey): number {
        if ((key === 'maxHp' || key === 'speed') && this.selectedBonus === key) {
            return this.baseValue + this.bonusValue;
        }
        return this.baseValue;
    }

    selectBonus(key: BonusAttributeKey): void {
        if (this.selectedBonus === key) {
            this.selectedBonus = null;
            this.updatePlayerStats(key, this.baseValue);
        } else {
            const previousBonus = this.selectedBonus;
            if (previousBonus) {
                this.updatePlayerStats(previousBonus, this.baseValue);
            }
            this.selectedBonus = key;
            this.updatePlayerStats(key, this.baseValue + this.bonusValue);
        }
    }

    isBonusSelected(key: BonusAttributeKey): boolean {
        return this.selectedBonus === key;
    }

    selectDice(key: 'attackDice' | 'defenseDice'): void {
        const currentDice = this.playerService.player()[key];
        const newDice = currentDice === DiceType.D6 ? DiceType.D4 : DiceType.D6;
        const otherKey = key === 'attackDice' ? 'defenseDice' : 'attackDice';
        const otherDice = newDice === DiceType.D6 ? DiceType.D4 : DiceType.D6;

        this.playerService.updatePlayer({
            [key]: newDice,
            [otherKey]: otherDice,
        });
    }

    isDiceSelected(key: 'attackDice' | 'defenseDice'): boolean {
        return this.playerService.player()[key] === DiceType.D6;
    }

    getDiceImage(diceType: DiceType): string {
        return this.assetsService.getDiceImage(diceType);
    }

    private updatePlayerStats(key: BonusAttributeKey, value: number): void {
        this.playerService.updatePlayer({
            [key]: value,
            ...(key === 'maxHp' ? { currentHp: value } : {}),
        });
    }
}
