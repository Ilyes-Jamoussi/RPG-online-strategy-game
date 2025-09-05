import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AssetsService } from '@app/services/assets/assets.service';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { Player } from '@common/models/player.model';

@Component({
    selector: 'app-game-session-players',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './game-session-players.component.html',
    styleUrls: ['./game-session-players.component.scss'],
})
export class GameSessionPlayersComponent {
    constructor(
        private readonly assetsService: AssetsService,
        private readonly gameSessionService: GameSessionService,
    ) {}

    protected get gameSessionPlayers(): Signal<Player[]> {
        return this.gameSessionService.players;
    }

    protected trackByPlayerId(index: number, player: Player): string {
        return player.id;
    }

    protected getAvatarUrl(avatar: AvatarName | null): string {
        return this.assetsService.getAvatarStaticImage(avatar);
    }
}
