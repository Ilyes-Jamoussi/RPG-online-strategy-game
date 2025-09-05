import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { PlayerService } from '@app/services/player/player.service';
import { SessionSocketService } from '@app/services/session-socket/session-socket.service';
import { SessionService } from '@app/services/session/session.service';
import { JoinGameSessionPageComponent } from './join-game-session-page.component';

describe('JoinGameSessionPageComponent', () => {
    let component: JoinGameSessionPageComponent;
    let fixture: ComponentFixture<JoinGameSessionPageComponent>;
    let sessionSocketServiceSpy: jasmine.SpyObj<SessionSocketService>;
    let sessionServiceSpy: jasmine.SpyObj<SessionService>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        sessionSocketServiceSpy = jasmine.createSpyObj('SessionSocketService', [
            'joinAvatarSelection',
            'onAvatarSelectionJoined',
            'onAvatarSelectionJoinError',
        ]);
        sessionServiceSpy = jasmine.createSpyObj('SessionService', ['updateSession']);
        playerServiceSpy = jasmine.createSpyObj('PlayerService', ['updatePlayer']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [JoinGameSessionPageComponent, ReactiveFormsModule],
            providers: [
                { provide: SessionSocketService, useValue: sessionSocketServiceSpy },
                { provide: SessionService, useValue: sessionServiceSpy },
                { provide: PlayerService, useValue: playerServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(JoinGameSessionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty access code', () => {
        expect(component.form.get('accessCode')?.value).toBe('');
    });

    it('should validate access code format', () => {
        const accessCodeControl = component.form.get('accessCode');

        accessCodeControl?.setValue('');
        expect(accessCodeControl?.errors?.['required']).toBeTruthy();

        accessCodeControl?.setValue('123');
        expect(accessCodeControl?.errors?.['pattern']).toBeTruthy();

        accessCodeControl?.setValue('12345');
        expect(accessCodeControl?.errors?.['pattern']).toBeTruthy();

        accessCodeControl?.setValue('1234');
        expect(accessCodeControl?.errors).toBeNull();
    });

    it('should handle successful join', () => {
        const sessionId = '1234';
        const playerId = 'player1';
        component.form.get('accessCode')?.setValue(sessionId);

        sessionSocketServiceSpy.onAvatarSelectionJoined.and.callFake((callback) => callback({ playerId }));

        component.onSubmit();

        expect(sessionSocketServiceSpy.joinAvatarSelection).toHaveBeenCalledWith({ sessionId });
        expect(playerServiceSpy.updatePlayer).toHaveBeenCalledWith({ id: playerId, isAdmin: false });
        expect(sessionServiceSpy.updateSession).toHaveBeenCalledWith({ id: sessionId });
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.characterCreation]);
    });

    it('should handle join error', () => {
        const errorMsg = 'Session not found';
        component.form.get('accessCode')?.setValue('1234');

        sessionSocketServiceSpy.onAvatarSelectionJoinError.and.callFake((callback) => callback(errorMsg));

        component.onSubmit();

        expect(component.errorMessage()).toBe(errorMsg);
    });

    it('should navigate back to home', () => {
        component.goBack();
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.home]);
    });
});
