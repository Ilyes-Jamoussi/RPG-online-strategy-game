import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AvatarSelectionPanelComponent } from '@app/components/avatar-selection-panel/avatar-selection-panel.component';
import { CharacterAttributesPanelComponent } from '@app/components/character-attributes-panel/character-attributes-panel.component';
import { ROUTES } from '@app/constants/routes.constants';
import { NotificationService } from '@app/services/notification/notification.service';
import { PlayerService } from '@app/services/player/player.service';
import { SessionSocketService } from '@app/services/session-socket/session-socket.service';
import { SessionService } from '@app/services/session/session.service';
import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { Player } from '@common/models/player.model';
import { CharacterCreationPageComponent } from './character-creation-page.component';

describe('CharacterCreationPageComponent', () => {
    let component: CharacterCreationPageComponent;
    let fixture: ComponentFixture<CharacterCreationPageComponent>;
    let sessionServiceSpy: jasmine.SpyObj<SessionService>;
    let sessionSocketServiceSpy: jasmine.SpyObj<SessionSocketService>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    const mockPlayer = {
        id: 'player1',
        name: 'Test Player',
        isAdmin: false,
    } as Player;

    const mockSessionId = 'session1';
    const mockMapSize = MapSize.Medium;
    const mockMap: Tile[][] = [[]];
    const mockItemContainers: ItemContainer[] = [];

    beforeEach(async () => {
        sessionServiceSpy = jasmine.createSpyObj('SessionService', ['map', 'mapSize', 'itemContainers', 'id', 'updateSession']);
        sessionSocketServiceSpy = jasmine.createSpyObj('SessionSocketService', [
            'createSession',
            'joinSession',
            'onSessionCreated',
            'onSessionJoined',
            'onSessionJoinError',
        ]);
        playerServiceSpy = jasmine.createSpyObj('PlayerService', ['isAdmin', 'player', 'updatePlayer']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['displayError']);

        // Default spy implementations
        sessionServiceSpy.map.and.returnValue(mockMap);
        sessionServiceSpy.mapSize.and.returnValue(mockMapSize);
        sessionServiceSpy.itemContainers.and.returnValue(mockItemContainers);
        sessionServiceSpy.id.and.returnValue(mockSessionId);
        playerServiceSpy.player.and.returnValue(mockPlayer);

        await TestBed.configureTestingModule({
            imports: [CharacterCreationPageComponent, AvatarSelectionPanelComponent, CharacterAttributesPanelComponent],
            providers: [
                { provide: SessionService, useValue: sessionServiceSpy },
                { provide: SessionSocketService, useValue: sessionSocketServiceSpy },
                { provide: PlayerService, useValue: playerServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: NotificationService, useValue: notificationServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CharacterCreationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Admin character creation', () => {
        beforeEach(() => {
            playerServiceSpy.isAdmin.and.returnValue(true);
        });

        it('should handle admin creation and navigate to waiting room on success', () => {
            const sessionData = { sessionId: 'newSession', playerId: 'newPlayer' };
            sessionSocketServiceSpy.onSessionCreated.and.callFake((callback) => callback(sessionData));

            component.onCharacterValidated();

            expect(sessionSocketServiceSpy.createSession).toHaveBeenCalledWith({
                player: mockPlayer,
                map: mockMap,
                itemContainers: mockItemContainers,
                mapSize: mockMapSize,
            });
            expect(sessionServiceSpy.updateSession).toHaveBeenCalledWith({ id: sessionData.sessionId });
            expect(playerServiceSpy.updatePlayer).toHaveBeenCalledWith({ id: sessionData.playerId });
            expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.playersWaitingRoom]);
        });
    });

    describe('Player character creation', () => {
        beforeEach(() => {
            playerServiceSpy.isAdmin.and.returnValue(false);
        });

        it('should handle player join and navigate to waiting room on success', () => {
            sessionSocketServiceSpy.onSessionJoined.and.callFake((callback) => callback({}));

            component.onCharacterValidated();

            expect(sessionSocketServiceSpy.joinSession).toHaveBeenCalledWith({
                player: mockPlayer,
                sessionId: mockSessionId,
            });
            expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.playersWaitingRoom]);
        });

        it('should display error notification on join error', () => {
            const errorMessage = 'Session full';
            sessionSocketServiceSpy.onSessionJoinError.and.callFake((callback) => callback(errorMessage));

            component.onCharacterValidated();

            expect(notificationServiceSpy.displayError).toHaveBeenCalledWith({
                title: 'Erreur',
                message: errorMessage,
            });
        });
    });
});
