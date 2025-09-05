import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { ROUTES } from '@app/constants/routes.constants';
import { GameStoreService } from '@app/services/game-store/game-store.service';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';

@Component({
    selector: 'app-game-management-page',
    templateUrl: './game-management-page.component.html',
    styleUrls: ['./game-management-page.component.scss'],
    standalone: true,
    imports: [CommonModule, GameCardComponent],
})
export class GameManagementPageComponent implements OnInit {
    constructor(
        private readonly router: Router,
        private readonly gameStoreService: GameStoreService,
    ) {}

    get gameDisplays(): Signal<DisplayGameDto[]> {
        return this.gameStoreService.gameDisplays;
    }

    ngOnInit(): void {
        this.gameStoreService.loadGames().subscribe();
    }

    onCreateNewGame(): void {
        this.router.navigate([ROUTES.gameSizeSelection]);
    }

    onEditGame(gameId: string): void {
        this.router.navigate([ROUTES.gameEditor]);
    }

    onDeleteGame(gameId: string): void {
        this.gameStoreService.deleteGame(gameId).subscribe();
    }

    onToggleVisibility(gameId: string): void {
        this.gameStoreService.toggleGameVisibility(gameId).subscribe();
    }

    goBack(): void {
        this.router.navigate(['/']);
    }
}
