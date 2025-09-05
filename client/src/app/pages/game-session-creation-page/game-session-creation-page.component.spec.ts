import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { GameStoreService } from '@app/services/game-store/game-store.service';
import { SessionService } from '@app/services/session/session.service';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { of } from 'rxjs';
import { GameSessionCreationPageComponent } from './game-session-creation-page.component';

describe('GameSessionCreationPageComponent', () => {
    let component: GameSessionCreationPageComponent;
    let fixture: ComponentFixture<GameSessionCreationPageComponent>;
    let gameStoreServiceSpy: jasmine.SpyObj<GameStoreService>;
    let sessionServiceSpy: jasmine.SpyObj<SessionService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockGames: DisplayGameDto[] = [
        {
            id: '1',
            name: 'Game 1',
            description: 'Description 1',
            size: 10,
            mapPreviewImageUrl: 'url1',
            lastModified: new Date(),
            visibility: true,
        },
    ];

    beforeEach(async () => {
        gameStoreServiceSpy = jasmine.createSpyObj('GameStoreService', ['loadGames'], {
            visibleGames: signal(mockGames),
        });
        gameStoreServiceSpy.loadGames.and.returnValue(of(mockGames));

        sessionServiceSpy = jasmine.createSpyObj('SessionService', ['loadGameInitializationData']);
        sessionServiceSpy.loadGameInitializationData.and.returnValue(of(undefined));

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [GameSessionCreationPageComponent],
            providers: [
                { provide: GameStoreService, useValue: gameStoreServiceSpy },
                { provide: SessionService, useValue: sessionServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSessionCreationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load games on init', () => {
        expect(gameStoreServiceSpy.loadGames).toHaveBeenCalled();
    });

    it('should return visible games from service', () => {
        expect(component.visibleGameDisplays()).toEqual(mockGames);
    });

    it('should navigate back to home', () => {
        component.onBack();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should start game and navigate to character creation', () => {
        const gameId = '1';
        component.onStartGame(gameId);
        expect(sessionServiceSpy.loadGameInitializationData).toHaveBeenCalledWith(gameId);
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.characterCreation]);
    });
});
