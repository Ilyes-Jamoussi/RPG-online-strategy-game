import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlayerService } from '@app/services/player/player.service';
import { AvatarName } from '@common/enums/avatar-name.enum';

@Component({
    selector: 'app-avatar-animated-display',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './avatar-animated-display.component.html',
    styleUrl: './avatar-animated-display.component.scss',
})
export class AvatarAnimatedDisplayComponent {
    constructor(private readonly playerService: PlayerService) {}

    get selectedAvatar(): AvatarName | null {
        return this.playerService.avatar();
    }

    get animatedAvatar(): string | null {
        return this.selectedAvatar ? `/assets/avatars/animated/${this.selectedAvatar}.gif` : null;
    }
}
