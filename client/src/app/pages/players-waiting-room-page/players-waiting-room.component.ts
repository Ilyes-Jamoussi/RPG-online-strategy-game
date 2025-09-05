import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatComponent } from '@app/components/chat/chat.component';
import { PlayersListComponent } from '@app/components/players-list/players-list.component';
import { RoomCodeComponent } from '@app/components/room-code/room-code.component';
import { WaitingRoomActionsComponent } from '@app/components/waiting-room-actions/waiting-room-actions.component';

@Component({
    selector: 'app-players-waiting-room-page',
    standalone: true,
    imports: [CommonModule, ChatComponent, PlayersListComponent, RoomCodeComponent, WaitingRoomActionsComponent],
    templateUrl: './players-waiting-room.component.html',
    styleUrls: ['./players-waiting-room.component.scss'],
})
export class PlayersWaitingRoomPageComponent {}
