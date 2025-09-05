import { BoardTile } from '@common/interfaces/board-tile.interface';
import { GameSession } from '@common/models/game-session.model';
import { Player } from '@common/models/player.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameSessionService {
    private readonly gameSessions = new Map<string, GameSession>();

    getGameSession(sessionId: string): GameSession | undefined {
        return this.gameSessions.get(sessionId);
    }

    getPlayers(sessionId: string): Player[] {
        return this.getGameSession(sessionId).players;
    }

    getBoard(sessionId: string): BoardTile[][] {
        return this.getGameSession(sessionId).board;
    }

    startGameSession(sessionId: string, gameSession: GameSession): void {
        this.gameSessions.set(sessionId, gameSession);
    }

    startTurn(sessionId: string, playerId: string): void {
        const gameSession = this.gameSessions.get(sessionId);
        if (!gameSession) {
            throw new Error('Game session not found');
        }
        this.setTurn(gameSession, playerId);
    }

    private setTurn(gameSession: GameSession, playerId: string): void {
        gameSession.players.forEach((player) => {
            player.isActive = false;
        });
        gameSession.players.find((player) => player.id === playerId).isActive = true;
    }
}
