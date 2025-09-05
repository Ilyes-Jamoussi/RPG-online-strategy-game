import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { AssetsService } from '@app/services/assets/assets.service';
import { PlayerService } from '@app/services/player/player.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { DiceType } from '@common/enums/dice-type.enum';
import { Player } from '@common/models/player.model';

const PERCENTAGE_FULL = 100;

@Component({
    selector: 'app-my-game-session-player-info',
    templateUrl: './my-game-session-player-info.component.html',
    styleUrls: ['./my-game-session-player-info.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class MyGameSessionPlayerInfoComponent {
    constructor(
        private readonly assetsService: AssetsService,
        private readonly playerService: PlayerService,
    ) {}

    protected get myPlayer(): Signal<Player> {
        return this.playerService.player;
    }

    protected get healthPercentage(): number {
        return (this.myPlayer().currentHp / this.myPlayer().maxHp) * PERCENTAGE_FULL;
    }

    protected getAvatarUrl(avatar: AvatarName | null): string {
        return this.assetsService.getAvatarStaticImage(avatar);
    }

    protected getDiceImage(diceType: DiceType): string {
        return this.assetsService.getDiceImage(diceType);
    }
}
