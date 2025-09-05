import { Injectable, Signal, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

const MILLISECONDS_IN_SECOND = 1000;
const DEFAULT_TIME_IN_SECONDS = 30;

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    private timerSubscription?: Subscription;
    private readonly _timeRemaining = signal<number>(DEFAULT_TIME_IN_SECONDS);
    private readonly _isRunning = signal<boolean>(false);

    get timeRemaining(): Signal<number> {
        return this._timeRemaining.asReadonly();
    }

    get isRunning(): Signal<boolean> {
        return this._isRunning.asReadonly();
    }

    start(): void {
        if (this._isRunning()) return;

        this._isRunning.set(true);
        this.timerSubscription = interval(MILLISECONDS_IN_SECOND).subscribe(() => {
            if (this._timeRemaining() <= 0) {
                this.stop();
                return;
            }
            this._timeRemaining.update((time) => time - 1);
        });
    }

    stop(): void {
        this._isRunning.set(false);
        this.timerSubscription?.unsubscribe();
    }

    reset(): void {
        this.stop();
        this._timeRemaining.set(DEFAULT_TIME_IN_SECONDS);
    }
}
