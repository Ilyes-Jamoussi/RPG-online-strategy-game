import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '@app/services/toast/toast.service';

const CIRCLE_CIRCUMFERENCE = 283; // 2 * π * r (r = 45)
const INITIAL_COUNTDOWN = 3;

@Component({
    selector: 'app-toast-notification',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './toast-notification.component.html',
    styleUrls: ['./toast-notification.component.scss'],
    animations: [
        trigger('toastAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
            transition(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))]),
        ]),
    ],
})
export class ToastNotificationComponent {
    message = this.toastService.message;
    countdown = this.toastService.countdown;

    constructor(private readonly toastService: ToastService) {}

    getProgressOffset(currentTime: number): number {
        const progress = currentTime / INITIAL_COUNTDOWN;
        return CIRCLE_CIRCUMFERENCE * (1 - progress);
    }
}
