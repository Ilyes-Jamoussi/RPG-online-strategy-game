export enum CombatActionType {
    ATTACK = 'ATTACK',
    ESCAPE = 'ESCAPE',
}

export interface CombatActionDto {
    sessionId: string;
    targetId: string;
    action: CombatActionType;
}

export interface CombatResultDto {
    attackerId: string;
    defenderId: string;
    damage?: number;
    escapeSuccess?: boolean;
    remainingEscapeAttempts: number;
    attackerHp: number;
    defenderHp: number;
    isOver: boolean;
    winnerId?: string;
}
