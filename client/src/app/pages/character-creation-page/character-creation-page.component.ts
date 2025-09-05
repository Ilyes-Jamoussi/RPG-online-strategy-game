import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarSelectionPanelComponent } from '@app/components/avatar-selection-panel/avatar-selection-panel.component';
import { CharacterAttributesPanelComponent } from '@app/components/character-attributes-panel/character-attributes-panel.component';
import { ROUTES } from '@app/constants/routes.constants';
import { NotificationService } from '@app/services/notification/notification.service';
import { PlayerService } from '@app/services/player/player.service';
import { SessionSocketService } from '@app/services/session-socket/session-socket.service';
import { SessionService } from '@app/services/session/session.service';
import { CreateSessionDto } from '@common/dto/session/create-session.dto';
import { JoinSessionDto } from '@common/dto/session/join-session.dto';
@Component({
    selector: 'app-character-creation-page',
    imports: [CommonModule, AvatarSelectionPanelComponent, CharacterAttributesPanelComponent],
    templateUrl: './character-creation-page.component.html',
    styleUrls: ['./character-creation-page.component.scss'],
})
export class CharacterCreationPageComponent {
    constructor(
        private readonly sessionService: SessionService,
        private readonly sessionSocketService: SessionSocketService,
        private readonly playerService: PlayerService,
        private readonly router: Router,
        private readonly notificationService: NotificationService,
    ) {}

    onCharacterValidated(): void {
        if (this.playerService.isAdmin()) {
            this.handleAdminCreation();
        } else {
            this.handlePlayerJoin();
        }
    }

    private handleAdminCreation(): void {
        const dto: CreateSessionDto = {
            player: this.playerService.player(),
            map: this.sessionService.map(),
            itemContainers: this.sessionService.itemContainers(),
            mapSize: this.sessionService.mapSize(),
        };

        this.sessionSocketService.createSession(dto);
        this.sessionSocketService.onSessionCreated((data) => {
            this.sessionService.updateSession({ id: data.sessionId });
            this.playerService.updatePlayer({ id: data.playerId });

            this.router.navigate([ROUTES.playersWaitingRoom]);
        });
    }

    private handlePlayerJoin(): void {
        const dto: JoinSessionDto = {
            player: this.playerService.player(),
            sessionId: this.sessionService.id(),
        };
        this.sessionSocketService.joinSession(dto);
        this.sessionSocketService.onSessionJoined(() => {
            this.router.navigate([ROUTES.playersWaitingRoom]);
        });

        this.sessionSocketService.onSessionJoinError((msg) => {
            this.notificationService.displayError({ title: 'Erreur', message: msg });
        });
    }
}
