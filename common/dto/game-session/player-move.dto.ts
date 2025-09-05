import { Position } from '@common/interfaces/position.interface';

export interface PlayerMoveDto {
    sessionId: string;
    position: Position;
}

export interface PlayerMovedDto {
    playerId: string;
    position: Position;
    remainingMoves: number;
}
