import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { ROUTES } from '@app/constants/routes.constants';
import { GameStoreService } from '@app/services/game-store/game-store.service';
import { SessionService } from '@app/services/session/session.service';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';

@Component({
    selector: 'app-game-session-creation-page',
    templateUrl: './game-session-creation-page.component.html',
    styleUrls: ['./game-session-creation-page.component.scss'],
    standalone: true,
    imports: [CommonModule, GameCardComponent],
})
export class GameSessionCreationPageComponent implements OnInit {
    constructor(
        private readonly router: Router,
        private readonly gameStoreService: GameStoreService,
        private readonly sessionService: SessionService,
    ) {}

    get visibleGameDisplays(): Signal<DisplayGameDto[]> {
        return this.gameStoreService.visibleGames;
    }

    ngOnInit(): void {
        this.gameStoreService.loadGames().subscribe();
    }

    onBack(): void {
        this.router.navigate(['/']);
    }

    onStartGame(gameId: string): void {
        this.sessionService.loadGameInitializationData(gameId).subscribe({
            next: () => {
                this.router.navigate([ROUTES.characterCreation]);
            },
        });
    }
}
