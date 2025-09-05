import { Injectable } from '@angular/core';
import { SocketService } from '@app/services/socket/socket.service';
import { SessionEvents } from '@common/constants/session-events';
import { CreateSessionDto, SessionCreatedDto } from '@common/dto/session/create-session.dto';
import { AvatarSelectionJoinedDto, JoinAvatarSelectionDto } from '@common/dto/session/join-avatar-selection.dto';
import { JoinSessionDto } from '@common/dto/session/join-session.dto';
import { StartGameSessionDto } from '@common/dto/session/start-game-session.dto';
import { AvatarAssignmentsUpdatedDto, UpdateAvatarAssignmentsDto } from '@common/dto/session/update-avatar-assignments.dto';
import { SessionPlayersUpdatedDto } from '@common/dto/session/update-session.dto';
import { VoidDto } from '@common/dto/session/void.dto';

@Injectable({ providedIn: 'root' })
export class SessionSocketService {
    constructor(private socket: SocketService) {}

    createSession(data: CreateSessionDto): void {
        this.socket.emit(SessionEvents.CreateSession, data);
    }

    lockSession(data: VoidDto): void {
        this.socket.emit(SessionEvents.LockSession, data);
    }

    unlockSession(data: VoidDto): void {
        this.socket.emit(SessionEvents.UnlockSession, data);
    }

    onSessionCreated(callback: (data: SessionCreatedDto) => void): void {
        this.socket.onSuccessEvent(SessionEvents.SessionCreated, callback);
    }

    onSessionCreatedError(callback: (msg: string) => void): void {
        this.socket.onErrorEvent(SessionEvents.SessionCreated, callback);
    }

    joinAvatarSelection(data: JoinAvatarSelectionDto): void {
        this.socket.emit(SessionEvents.JoinAvatarSelection, data);
    }

    onAvatarSelectionJoined(callback: (data: AvatarSelectionJoinedDto) => void): void {
        this.socket.onSuccessEvent(SessionEvents.AvatarSelectionJoined, callback);
    }

    onAvatarSelectionJoinError(callback: (msg: string) => void): void {
        this.socket.onErrorEvent(SessionEvents.AvatarSelectionJoined, callback);
    }

    joinSession(data: JoinSessionDto): void {
        this.socket.emit(SessionEvents.JoinSession, data);
    }

    onSessionJoined(callback: (data: VoidDto) => void): void {
        this.socket.onSuccessEvent(SessionEvents.SessionJoined, callback);
    }

    onSessionJoinError(callback: (msg: string) => void): void {
        this.socket.onErrorEvent(SessionEvents.SessionJoined, callback);
    }

    updateAvatarsAssignment(data: UpdateAvatarAssignmentsDto): void {
        this.socket.emit(SessionEvents.UpdateAvatarAssignments, data);
    }

    startGameSession(data: StartGameSessionDto): void {
        this.socket.emit(SessionEvents.StartGameSession, data);
    }

    onGameSessionStarted(callback: (data: StartGameSessionDto) => void): void {
        this.socket.onSuccessEvent(SessionEvents.GameSessionStarted, callback);
    }

    onAvatarAssignmentsUpdated(callback: (data: AvatarAssignmentsUpdatedDto) => void): void {
        this.socket.onSuccessEvent(SessionEvents.AvatarAssignmentsUpdated, callback);
    }

    onSessionPlayersUpdated(callback: (data: SessionPlayersUpdatedDto) => void): void {
        this.socket.onSuccessEvent(SessionEvents.SessionPlayersUpdated, callback);
    }
}
