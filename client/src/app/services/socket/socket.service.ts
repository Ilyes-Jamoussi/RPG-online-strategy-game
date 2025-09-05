import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameSessionEvents } from '@common/constants/game-session-events';
import { GameStoreEvents } from '@common/constants/game-store-events';
import { SessionEvents } from '@common/constants/session-events';
import { SocketResponse } from '@common/types/socket-response.type';
import { fromEvent, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private socket: Socket;
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.socket = io(environment.socketUrl);
    }

    emit<T>(event: SessionEvents | GameStoreEvents | GameSessionEvents, data: T): void {
        this.socket.emit(event, data);
    }

    onEvent<T>(event: SessionEvents | GameStoreEvents | GameSessionEvents): Observable<SocketResponse<T>> {
        return fromEvent<SocketResponse<T>>(this.socket, event);
    }

    onSuccessEvent<T>(event: SessionEvents | GameStoreEvents | GameSessionEvents, next: (data: T) => void): void {
        this.onEvent<T>(event)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                if (res.success) {
                    next(res.data);
                }
            });
    }

    onErrorEvent(event: SessionEvents | GameStoreEvents | GameSessionEvents, next: (message: string) => void): void {
        this.onEvent<never>(event)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                if (!res.success) {
                    next(res.message);
                }
            });
    }
}
