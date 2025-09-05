import { Injectable, Signal, signal } from '@angular/core';
import { timer } from 'rxjs';

export interface PlayerTurnMessage {
    playerName: string;
}

const TOAST_DURATION = 3000; // 3 seconds
const INITIAL_COUNTDOWN = 3;
const COUNTDOWN_INTERVAL = 1000; // 1 second
const MIN_COUNTDOWN = 1;

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private readonly _message = signal<PlayerTurnMessage | null>(null);
    private readonly _countdown = signal<number>(INITIAL_COUNTDOWN);

    get message(): Signal<PlayerTurnMessage | null> {
        return this._message.asReadonly();
    }

    get countdown(): Signal<number> {
        return this._countdown.asReadonly();
    }

    showPlayerTurn(playerName: string): void {
        this._message.set({ playerName });
        this._countdown.set(INITIAL_COUNTDOWN);

        // Countdown from 3 to 1
        const countdownInterval = setInterval(() => {
            const currentCount = this._countdown();
            if (currentCount > MIN_COUNTDOWN) {
                this._countdown.set(currentCount - 1);
            } else {
                clearInterval(countdownInterval);
            }
        }, COUNTDOWN_INTERVAL);

        // Clear message after 3 seconds
        timer(TOAST_DURATION).subscribe(() => {
            this._message.set(null);
            clearInterval(countdownInterval);
        });
    }
}
