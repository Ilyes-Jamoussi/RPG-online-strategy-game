import { Player } from '@common/models/player.model';

export interface JoinSessionDto {
    sessionId: string;
    player: Player;
}
