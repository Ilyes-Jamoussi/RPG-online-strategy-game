import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { ROUTES } from '@app/constants/routes.constants';
import { GameStoreService } from '@app/services/game-store/game-store.service';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { of } from 'rxjs';
import { GameManagementPageComponent } from './game-management-page.component';

describe('GameManagementPageComponent', () => {
    let component: GameManagementPageComponent;
    let fixture: ComponentFixture<GameManagementPageComponent>;
    let gameStoreServiceSpy: jasmine.SpyObj<GameStoreService>;
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
        {
            id: '2',
            name: 'Game 2',
            description: 'Description 2',
            size: 15,
            mapPreviewImageUrl: 'url2',
            lastModified: new Date(),
            visibility: false,
        },
    ];

    beforeEach(async () => {
        gameStoreServiceSpy = jasmine.createSpyObj('GameStoreService', ['loadGames', 'deleteGame', 'toggleGameVisibility'], {
            gameDisplays: signal(mockGames),
        });
        gameStoreServiceSpy.loadGames.and.returnValue(of(mockGames));
        gameStoreServiceSpy.deleteGame.and.returnValue(of(undefined));
        gameStoreServiceSpy.toggleGameVisibility.and.returnValue(of(undefined));

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [GameManagementPageComponent, GameCardComponent],
            providers: [
                { provide: GameStoreService, useValue: gameStoreServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameManagementPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load games on init', () => {
        expect(gameStoreServiceSpy.loadGames).toHaveBeenCalled();
    });

    it('should return games from service', () => {
        expect(component.gameDisplays()).toEqual(mockGames);
    });

    it('should navigate to game size selection on create new game', () => {
        component.onCreateNewGame();
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.gameSizeSelection]);
    });

    it('should navigate to game editor on edit game', () => {
        component.onEditGame('1');
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.gameEditor]);
    });

    it('should delete game', () => {
        const gameId = '1';
        component.onDeleteGame(gameId);
        expect(gameStoreServiceSpy.deleteGame).toHaveBeenCalledWith(gameId);
    });

    it('should toggle game visibility', () => {
        const gameId = '1';
        component.onToggleVisibility(gameId);
        expect(gameStoreServiceSpy.toggleGameVisibility).toHaveBeenCalledWith(gameId);
    });

    it('should navigate to home on go back', () => {
        component.goBack();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
});
