import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AssetsService } from '@app/services/assets/assets.service';
import { PlayerService } from '@app/services/player/player.service';
import { AvatarAssignment } from '@common/models/session.model';

type AvatarSelectionState = 'available' | 'mine' | 'taken';

@Component({
    selector: 'app-avatar-card',
    imports: [CommonModule],
    templateUrl: './avatar-card.component.html',
    styleUrls: ['./avatar-card.component.scss'],
})
export class AvatarCardComponent {
    @Input() assignment!: AvatarAssignment;

    constructor(
        private readonly playerService: PlayerService,
        private readonly assetsService: AssetsService,
    ) {}

    get selectionState(): AvatarSelectionState {
        if (!this.assignment.chosenBy) return 'available';
        return this.assignment.chosenBy === this.playerService.id() ? 'mine' : 'taken';
    }

    select(): void {
        if (this.selectionState === 'available') {
            this.playerService.selectAvatar(this.assignment.avatarName);
        }
    }

    getAvatarImage(): string {
        return this.assetsService.getAvatarStaticImage(this.assignment.avatarName);
    }
}
