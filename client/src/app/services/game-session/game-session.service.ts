import { computed, Injectable, Signal, signal } from '@angular/core';
import { MAX_VICTORY_POINTS } from '@app/constants/player.constants';
import { ONE_SECOND, TURN_DURATION } from '@app/constants/time.constants';
import { GameBoardService } from '@app/services/game-board/game-board.service';
import { NotificationService } from '@app/services/notification/notification.service';
import { TimerService } from '@app/services/timer/timer.service';
import { ToastService } from '@app/services/toast/toast.service';
import { MapSize } from '@common/enums/map-size.enum';
import { BoardTile } from '@common/interfaces/board-tile.interface';
import { Position } from '@common/interfaces/position.interface';
import { GameSession } from '@common/models/game-session.model';
import { Player } from '@common/models/player.model';
import { Session } from '@common/models/session.model';
@Injectable({
    providedIn: 'root',
})
export class GameSessionService {
    private readonly _gameSession = signal<GameSession>({
        board: [],
        players: [],
        mapSize: MapSize.Small,
    });

    private countdownIntervalId: ReturnType<typeof setInterval> | null = null;

    constructor(
        private readonly gameBoardService: GameBoardService,
        private readonly toastService: ToastService,
        private readonly timerService: TimerService,
        private readonly notificationService: NotificationService,
    ) {}

    get gameSession(): Signal<GameSession> {
        return this._gameSession.asReadonly();
    }

    get board(): Signal<BoardTile[][]> {
        return computed(() => this.gameSession().board);
    }

    get players(): Signal<Player[]> {
        return computed(() => this.gameSession().players);
    }

    get mapSize(): MapSize {
        return this.gameSession().mapSize;
    }

    get activePlayer(): Signal<Player | null> {
        return computed(() => this.players().find((player) => player.isActive) ?? null);
    }

    get playersCount(): Signal<number> {
        return computed(() => this.players().filter((player) => !player.hasAbandoned).length);
    }

    setGameSession(gameSession: GameSession): void {
        this._gameSession.set(gameSession);
    }

    setBoard(board: BoardTile[][]): void {
        this._gameSession.update((gameSession) => ({ ...gameSession, board }));
    }

    setPlayers(players: Player[]): void {
        this._gameSession.update((gameSession) => ({ ...gameSession, players }));
    }

    initializeGame(session: Session): void {
        const players = session.players.map((player) => {
            const starting = player.startingPoint || { x: 0, y: 0 };
            return {
                ...player,
                startingPoint: starting,
                currentPosition: starting,
            };
        });

        const board = this.gameBoardService.prepareGameBoard(
            session.gameInitializationData.map,
            session.gameInitializationData.itemContainers,
            players,
        );

        const orderedPlayers = this.getPlayersOrderedBySpeed(players);
        this._gameSession.set({
            board,
            players: orderedPlayers,
            mapSize: session.gameInitializationData.mapSize,
        });
    }

    getPlayerById(playerId: string): Player | null {
        return this.players().find((p) => p.id === playerId) ?? null;
    }

    getTileOccupant(tile: BoardTile): Player | null {
        if (!tile.occupantId) return null;
        return this.getPlayerById(tile.occupantId);
    }

    getTileAt(position: Position): BoardTile | null {
        return this.board()[position.y]?.[position.x] ?? null;
    }

    startNextTurn(): void {
        const current = this.activePlayer();
        const next = this.getNextPlayer(current?.id);

        if (!next || next.id === current?.id) {
            this.evaluateVictory(current);
            return;
        }

        this.setPlayerActive(current?.id ?? null, false);
        this.setPlayerActive(next.id, true);

        this.toastService.showPlayerTurn(next.name);

        this.updateReachableTiles();

        setTimeout(() => {
            this.timerService.reset();
            this.timerService.start();
            this.monitorTimerCountdown();
        }, TURN_DURATION);
    }

    endTurn(): void {
        this.timerService.stop();
        this.stopCountdown();

        const current = this.activePlayer();
        const next = this.getNextPlayer(current?.id);

        if (!next || next.id === current?.id) {
            this.evaluateVictory(current);
            return;
        }

        this.setPlayerActive(current?.id ?? null, false);
        this.setPlayerActive(next.id, true);

        this.startNextTurn();
    }

    updateReachableTiles(): void {
        const player = this.activePlayer();
        if (!player) return;

        const newBoard = this.gameBoardService.highlightReachableAndPath(this.board(), player.currentPosition, player.remainingMoves);

        this.setBoard(newBoard);
    }

    highlightReachablePathTo(target: Position): void {
        const player = this.activePlayer();
        if (!player) return;

        const boardWithHighlights = this.gameBoardService.highlightReachableAndPath(
            this.board(),
            player.currentPosition,
            player.remainingMoves,
            target,
        );

        this.setBoard(boardWithHighlights);
    }

    clearPathHighlight(): void {
        const player = this.activePlayer();
        if (!player) return;

        const boardWithoutPath = this.gameBoardService.highlightReachableAndPath(
            this.board(),
            player.currentPosition,
            player.remainingMoves,
            undefined,
        );

        this.setBoard(boardWithoutPath);
    }

    private getPlayersOrderedBySpeed(players: Player[]): Player[] {
        const shuffled = this.gameBoardService.shuffleArray(players);
        return shuffled.sort((a, b) => b.speed - a.speed);
    }

    private setPlayerActive(playerId: string | null, active: boolean): void {
        const updated = this.players().map((p) => (p.id === playerId ? { ...p, isActive: active } : p));
        this._gameSession.update((gameSession) => ({ ...gameSession, players: updated }));
    }

    private getNextPlayer(currentId?: string): Player | null {
        const players = this.players().filter((p) => !p.hasAbandoned);
        if (players.length === 0) return null;

        const currentIndex = currentId ? players.findIndex((p) => p.id === currentId) : -1;

        let nextIndex = (currentIndex + 1) % players.length;

        while (players[nextIndex].hasAbandoned) {
            nextIndex = (nextIndex + 1) % players.length;
            if (nextIndex === currentIndex) return null;
        }

        return players[nextIndex];
    }

    private monitorTimerCountdown(): void {
        this.countdownIntervalId = setInterval(() => {
            if (this.timerService.timeRemaining() <= 0) {
                this.stopCountdown(); // ⬅️ nouvelle méthode
                this.endTurn();
            }
        }, ONE_SECOND);
    }

    private stopCountdown(): void {
        if (this.countdownIntervalId) {
            clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = null;
        }
    }

    private evaluateVictory(player: Player | null): void {
        if (!player) return;

        if (player.combatsWon >= MAX_VICTORY_POINTS) {
            this.notificationService.displayVictory({
                title: 'Victoire !',
                message: `${player.name} a remporté 3 combats 🎉`,
            });
        } else if (this.playersCount() === 1) {
            this.notificationService.displayVictory({
                title: 'Victoire par abandon !',
                message: `${player.name} est le seul survivant.`,
            });
        }
    }
}
