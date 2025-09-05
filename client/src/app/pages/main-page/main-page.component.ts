import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { TimerService } from '@app/services/timer/timer.service';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class MainPageComponent {
    readonly teamInfo = {
        number: 114,
        members: ['Jamoussi Ilyes'],
    };

    readonly gameTitle = 'Vallhalla';

    constructor(
        private router: Router,
        private timerService: TimerService,
    ) {}

    navigateToJoinGame(): void {
        this.router.navigate([ROUTES.joinSession]);
        this.timerService.start();
    }

    navigateToCreateGame(): void {
        this.router.navigate([ROUTES.gameSessionCreation]);
    }

    navigateToGameManagement(): void {
        this.router.navigate([ROUTES.gameManagement]);
    }
}
