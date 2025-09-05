import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameBoardComponent } from '@app/components/game-board/game-board.component';
import { GameSessionInfoComponent } from '@app/components/game-session-info/game-session-info.component';
import { GameSessionPlayersComponent } from '@app/components/game-session-players/game-session-players.component';
import { MatchActionsComponent } from '@app/components/match-actions/match-actions.component';
import { MatchMessagesComponent } from '@app/components/match-messages/match-messages.component';
import { MyGameSessionPlayerInfoComponent } from '@app/components/my-game-session-player-info/my-game-session-player-info.component';
import { PlayerInventoryComponent } from '@app/components/player-inventory/player-inventory.component';
import { TimerComponent } from '@app/components/timer/timer.component';
import { GameSessionService } from '@app/services/game-session/game-session.service';

@Component({
    selector: 'app-game-session-view-page',
    templateUrl: './game-session-view-page.component.html',
    styleUrls: ['./game-session-view-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        GameBoardComponent,
        MyGameSessionPlayerInfoComponent,
        GameSessionInfoComponent,
        GameSessionPlayersComponent,
        MatchActionsComponent,
        MatchMessagesComponent,
        PlayerInventoryComponent,
        TimerComponent,
    ],
})
export class GameSessionViewPageComponent implements OnInit {
    constructor(
        private readonly gameSessionService: GameSessionService,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        if (!this.gameSessionService.activePlayer()) {
            this.gameSessionService.startNextTurn();
        }
    }
    protected onEndTurn(): void {
        // Will be implemented later
    }

    protected onAction(): void {
        // Will be implemented later
    }

    protected onAbandon(): void {
        this.router.navigate(['/']);
    }
}
