import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { MapSize } from '@common/enums/map-size.enum';
import { Player } from '@common/models/player.model';

@Component({
    selector: 'app-game-session-info',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './game-session-info.component.html',
    styleUrls: ['./game-session-info.component.scss'],
})
export class GameSessionInfoComponent {
    constructor(private readonly gameSessionService: GameSessionService) {}

    protected get activePlayer(): Signal<Player | null> {
        return this.gameSessionService.activePlayer;
    }

    protected get playersCount(): Signal<number> {
        return this.gameSessionService.playersCount;
    }

    protected get mapSize(): MapSize {
        return this.gameSessionService.mapSize;
    }
}
