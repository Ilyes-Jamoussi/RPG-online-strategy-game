export interface LeaveSessionDto {
    playerName: string;
    playerAvatar: string;
}

export interface SessionLeftDto {
    success: true;
    message?: string;
}
