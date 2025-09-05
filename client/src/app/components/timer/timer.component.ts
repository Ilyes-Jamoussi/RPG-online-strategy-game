import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TimerService } from '@app/services/timer/timer.service';

const SECONDS_IN_MINUTE = 60;
const CIRCLE_CIRCUMFERENCE = 283; // 2 * π * r (r = 45)
const DEFAULT_INITIAL_TIME = 30;

@Component({
    selector: 'app-timer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
    timeRemaining = this.timerService.timeRemaining;
    private initialTime = DEFAULT_INITIAL_TIME;

    constructor(private readonly timerService: TimerService) {}

    ngOnInit(): void {
        this.initialTime = this.timeRemaining();
    }

    formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
        const remainingSeconds = seconds % SECONDS_IN_MINUTE;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getProgressOffset(currentTime: number): number {
        const progress = currentTime / this.initialTime;
        return CIRCLE_CIRCUMFERENCE * (1 - progress);
    }
}
