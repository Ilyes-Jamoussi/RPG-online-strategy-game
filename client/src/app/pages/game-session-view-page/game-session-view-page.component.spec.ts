import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameBoardComponent } from '@app/components/game-board/game-board.component';
import { GameSessionInfoComponent } from '@app/components/game-session-info/game-session-info.component';
import { GameSessionPlayersComponent } from '@app/components/game-session-players/game-session-players.component';
import { MatchActionsComponent } from '@app/components/match-actions/match-actions.component';
import { MatchMessagesComponent } from '@app/components/match-messages/match-messages.component';
import { MyGameSessionPlayerInfoComponent } from '@app/components/my-game-session-player-info/my-game-session-player-info.component';
import { PlayerInventoryComponent } from '@app/components/player-inventory/player-inventory.component';
import { TimerComponent } from '@app/components/timer/timer.component';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { GameSessionViewPageComponent } from './game-session-view-page.component';

describe('GameSessionViewPageComponent', () => {
    let component: GameSessionViewPageComponent;
    let fixture: ComponentFixture<GameSessionViewPageComponent>;
    let gameSessionServiceSpy: jasmine.SpyObj<GameSessionService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let activePlayerSignal: WritableSignal<any>;

    beforeEach(async () => {
        activePlayerSignal = signal(null);
        gameSessionServiceSpy = jasmine.createSpyObj('GameSessionService', ['startNextTurn'], {
            activePlayer: activePlayerSignal,
        });
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                GameSessionViewPageComponent,
                GameBoardComponent,
                MyGameSessionPlayerInfoComponent,
                GameSessionInfoComponent,
                GameSessionPlayersComponent,
                MatchActionsComponent,
                MatchMessagesComponent,
                PlayerInventoryComponent,
                TimerComponent,
            ],
            providers: [
                { provide: GameSessionService, useValue: gameSessionServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSessionViewPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should start next turn on init if no active player', () => {
        component.ngOnInit();
        expect(gameSessionServiceSpy.startNextTurn).toHaveBeenCalled();
    });

    it('should not start next turn on init if there is an active player', () => {
        activePlayerSignal.set({ id: '1', name: 'Player 1' });
        component.ngOnInit();
        expect(gameSessionServiceSpy.startNextTurn).not.toHaveBeenCalled();
    });

    it('should navigate to home when abandoning game', () => {
        (component as any).onAbandon();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
});
