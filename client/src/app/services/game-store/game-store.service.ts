import { computed, Injectable, Signal, signal } from '@angular/core';
import { GameHttpService } from '@app/services/game-http/game-http.service';
import { GameStoreSocketService } from '@app/services/game-store-socket/game-store-socket.service';
import { CreateGameDto } from '@common/dto/game-store/create-game.dto';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { UpdateGameDto } from '@common/dto/game-store/update-game.dto';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStoreService {
    private readonly _gameDisplays = signal<DisplayGameDto[]>([]);

    constructor(
        private readonly gameHttpService: GameHttpService,
        private readonly gameStoreSocketService: GameStoreSocketService,
    ) {
        this.initListeners();
    }

    get gameDisplays(): Signal<DisplayGameDto[]> {
        return this._gameDisplays.asReadonly();
    }

    get visibleGames(): Signal<DisplayGameDto[]> {
        return computed(() => this._gameDisplays().filter((game) => game.visibility));
    }

    loadGames(): Observable<DisplayGameDto[]> {
        return this.gameHttpService.getGamesDisplay().pipe(tap((games) => this._gameDisplays.set(games)));
    }

    createGame(dto: CreateGameDto): Observable<void> {
        return this.gameHttpService.createGame(dto);
    }

    updateGame(id: string, dto: UpdateGameDto): Observable<void> {
        return this.gameHttpService.updateGame(id, dto);
    }

    deleteGame(id: string): Observable<void> {
        return this.gameHttpService.deleteGame(id);
    }

    toggleGameVisibility(id: string): Observable<void> {
        const game = this._gameDisplays().find((g) => g.id === id);
        if (!game) {
            throw new Error('Game not found');
        }
        return this.gameHttpService.toggleVisibility(id, { visibility: !game.visibility });
    }

    private initListeners(): void {
        this.gameStoreSocketService.onGameCreated((game) => this.insertGameDisplay(game));
        this.gameStoreSocketService.onGameUpdated((game) => this.replaceGameDisplay(game));
        this.gameStoreSocketService.onGameDeleted(({ id }) => this.removeGameDisplay(id));
        this.gameStoreSocketService.onGameVisibilityToggled(({ id }) => this.toggleGameDisplayVisibility(id));
    }

    private insertGameDisplay(game: DisplayGameDto): void {
        this._gameDisplays.update((games) => [...games, game]);
    }

    private replaceGameDisplay(game: DisplayGameDto): void {
        this._gameDisplays.update((games) => games.map((g) => (g.id === game.id ? game : g)));
    }

    private removeGameDisplay(id: string): void {
        this._gameDisplays.update((games) => games.filter((g) => g.id !== id));
    }

    private toggleGameDisplayVisibility(id: string): void {
        this._gameDisplays.update((games) => games.map((g) => (g.id === id ? { ...g, visibility: !g.visibility } : g)));
    }
}
