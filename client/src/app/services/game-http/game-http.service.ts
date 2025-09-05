import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PATHS } from '@common/constants/api-paths';
import { CreateGameDto } from '@common/dto/game-store/create-game.dto';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { GameInitializationDataDto } from '@common/dto/game-store/game-initialization-data.dto';
import { ToggleVisibilityDto } from '@common/dto/game-store/toggle-visibility.dto';
import { UpdateGameDto } from '@common/dto/game-store/update-game.dto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class GameHttpService {
    private readonly baseUrl: string = environment.serverUrl;
    private readonly gamesEndpoint: string = `${this.baseUrl}${API_PATHS.games.base}`;

    constructor(private readonly http: HttpClient) {}

    getGamesDisplay(): Observable<DisplayGameDto[]> {
        return this.http.get<DisplayGameDto[]>(`${this.gamesEndpoint}/displays`);
    }

    getGameInitializationData(gameId: string): Observable<GameInitializationDataDto> {
        return this.http.get<GameInitializationDataDto>(`${this.gamesEndpoint}/${gameId}/initialization-data`);
    }

    createGame(dto: CreateGameDto): Observable<void> {
        return this.http.post<void>(this.gamesEndpoint, dto);
    }

    updateGame(id: string, dto: UpdateGameDto): Observable<void> {
        return this.http.patch<void>(`${this.gamesEndpoint}/${id}`, dto);
    }

    deleteGame(id: string): Observable<void> {
        return this.http.delete<void>(`${this.gamesEndpoint}/${id}`);
    }

    toggleVisibility(id: string, dto: ToggleVisibilityDto): Observable<void> {
        return this.http.patch<void>(`${this.gamesEndpoint}/${id}/visibility`, dto);
    }
}
