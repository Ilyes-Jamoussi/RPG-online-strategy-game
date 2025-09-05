import { computed, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { DEFAULT_SESSION, MAX_SESSION_PLAYERS, MIN_SESSION_PLAYERS } from '@app/constants/session.constants';
import { GameHttpService } from '@app/services/game-http/game-http.service';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { SessionSocketService } from '@app/services/session-socket/session-socket.service';
import { StartGameSessionDto } from '@common/dto/session/start-game-session.dto';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { Player } from '@common/models/player.model';
import { AvatarAssignment, Session } from '@common/models/session.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private readonly _session = signal<Session>({ ...DEFAULT_SESSION });

    constructor(
        private gameSessionService: GameSessionService,
        private sessionSocketService: SessionSocketService,
        private gameHttpService: GameHttpService,
        private router: Router,
    ) {
        this.initListeners();
    }

    get session(): Signal<Session> {
        return this._session.asReadonly();
    }

    get id(): Signal<string> {
        return computed(() => this.session().id);
    }

    get players(): Signal<Player[]> {
        return computed(() => this.session().players);
    }

    get avatarAssignments(): Signal<AvatarAssignment[]> {
        return computed(() => this.session().avatarAssignments);
    }

    get isRoomLocked(): Signal<boolean> {
        return computed(() => this.session().isRoomLocked);
    }

    get map(): Signal<Tile[][]> {
        return computed(() => this.session().gameInitializationData.map);
    }

    get itemContainers(): Signal<ItemContainer[]> {
        return computed(() => this.session().gameInitializationData.itemContainers);
    }

    get mapSize(): Signal<MapSize> {
        return computed(() => this.session().gameInitializationData.mapSize);
    }

    updateSession(partial: Partial<Session>): void {
        this._session.update((session) => ({ ...session, ...partial }));
    }

    resetSession(): void {
        this._session.set({ ...DEFAULT_SESSION });
    }

    lock(): void {
        this.updateSession({ isRoomLocked: true });
        this.sessionSocketService.lockSession({});
    }

    unlock(): void {
        this.updateSession({ isRoomLocked: false });
        this.sessionSocketService.unlockSession({});
    }

    canBeLocked(): boolean {
        return !this.isRoomLocked();
    }

    canBeUnlocked(): boolean {
        return this.isRoomLocked() && this.players().length < MAX_SESSION_PLAYERS;
    }

    canStartGame(): boolean {
        return this.isRoomLocked() && this.players().length >= MIN_SESSION_PLAYERS;
    }

    assignAvatar(playerId: string, avatar: AvatarName): void {
        const updated = this._session().avatarAssignments.map((assignment) => {
            const isOldChoice = assignment.chosenBy === playerId;
            const isNewChoice = assignment.avatarName === avatar;

            if (isOldChoice) return { ...assignment, chosenBy: null };
            if (isNewChoice) return { ...assignment, chosenBy: playerId };
            return assignment;
        });

        this.updateSession({ avatarAssignments: updated });
    }

    loadGameInitializationData(gameId: string): Observable<void> {
        return this.gameHttpService.getGameInitializationData(gameId).pipe(
            tap((data) => {
                this.updateSession({
                    gameInitializationData: {
                        mapSize: data.mapSize,
                        map: data.map,
                        itemContainers: data.itemContainers,
                    },
                });
            }),
            map(() => undefined),
        );
    }

    startGame(): void {
        this.gameSessionService.initializeGame(this.session());
        const gameSession = this.gameSessionService.gameSession();
        this.sessionSocketService.startGameSession({ gameSession });
    }

    private navigateToGamePage(): void {
        this.router.navigate([ROUTES.gameSession]);
    }

    private handleGameStart(data: StartGameSessionDto): void {
        this.gameSessionService.setGameSession(data.gameSession);
        this.navigateToGamePage();
    }

    private initListeners(): void {
        this.sessionSocketService.onSessionPlayersUpdated((data) => this.updateSession({ players: data.players }));

        this.sessionSocketService.onAvatarAssignmentsUpdated((data) => this.updateSession({ avatarAssignments: data.avatarAssignments }));

        this.sessionSocketService.onAvatarSelectionJoined((data) => this.updateSession({ id: data.playerId }));

        this.sessionSocketService.onGameSessionStarted((data) => this.handleGameStart(data));
    }
}
