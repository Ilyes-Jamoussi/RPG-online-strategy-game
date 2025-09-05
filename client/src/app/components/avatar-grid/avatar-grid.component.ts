import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarCardComponent } from '@app/components/avatar-card/avatar-card.component';
import { SessionService } from '@app/services/session/session.service';
import { AvatarAssignment } from '@common/models/session.model';

@Component({
    selector: 'app-avatar-grid',
    imports: [CommonModule, AvatarCardComponent],
    templateUrl: './avatar-grid.component.html',
    styleUrls: ['./avatar-grid.component.scss'],
})
export class AvatarGridComponent {
    constructor(private readonly sessionService: SessionService) {}

    get assignments(): AvatarAssignment[] {
        return this.sessionService.avatarAssignments();
    }
}
