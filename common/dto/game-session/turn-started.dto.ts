import { Player } from '@common/models/player.model';

export interface StartTurnDto {
    sessionId: string;
}

export interface TurnStartedDto {
    players: Player[];
}
