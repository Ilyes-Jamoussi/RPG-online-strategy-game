import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { PlayerService } from '@app/services/player/player.service';
import { SessionSocketService } from '@app/services/session-socket/session-socket.service';
import { SessionService } from '@app/services/session/session.service';

@Component({
    selector: 'app-join-game-session-page',
    imports: [FormsModule, CommonModule, ReactiveFormsModule],
    templateUrl: './join-game-session-page.component.html',
    styleUrl: './join-game-session-page.component.scss',
})
export class JoinGameSessionPageComponent {
    readonly errorMessage = signal<string | null>(null);

    readonly form = new FormGroup({
        accessCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
    });

    constructor(
        private readonly router: Router,
        private readonly sessionSocketService: SessionSocketService,
        private readonly sessionService: SessionService,
        private readonly playerService: PlayerService,
    ) {}

    get accessCode(): FormControl {
        return this.form.get('accessCode') as FormControl;
    }

    onSubmit(): void {
        const sessionId = this.accessCode.value as string;
        this.sessionSocketService.joinAvatarSelection({ sessionId });

        this.sessionSocketService.onAvatarSelectionJoined((data) => {
            this.playerService.updatePlayer({ id: data.playerId, isAdmin: false });
            this.sessionService.updateSession({ id: sessionId });
            this.router.navigate([ROUTES.characterCreation]);
        });

        this.sessionSocketService.onAvatarSelectionJoinError((msg) => {
            this.errorMessage.set(msg);
        });
    }

    goBack(): void {
        this.router.navigate([ROUTES.home]);
    }
}
