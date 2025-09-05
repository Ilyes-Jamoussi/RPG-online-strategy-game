import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from '@app/components/chat/chat.component';
import { PlayersListComponent } from '@app/components/players-list/players-list.component';
import { RoomCodeComponent } from '@app/components/room-code/room-code.component';
import { WaitingRoomActionsComponent } from '@app/components/waiting-room-actions/waiting-room-actions.component';
import { PlayersWaitingRoomPageComponent } from './players-waiting-room.component';

describe('PlayersWaitingRoomComponent', () => {
    let component: PlayersWaitingRoomPageComponent;
    let fixture: ComponentFixture<PlayersWaitingRoomPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlayersWaitingRoomPageComponent, ChatComponent, PlayersListComponent, RoomCodeComponent, WaitingRoomActionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlayersWaitingRoomPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have required components', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('app-chat')).toBeTruthy();
        expect(compiled.querySelector('app-players-list')).toBeTruthy();
        expect(compiled.querySelector('app-room-code')).toBeTruthy();
        expect(compiled.querySelector('app-waiting-room-actions')).toBeTruthy();
    });
});
