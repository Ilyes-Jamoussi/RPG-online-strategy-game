import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { TimerService } from '@app/services/timer/timer.service';
import { MainPageComponent } from './main-page.component';

const TEAM_NUMBER = 114;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let routerSpy: jasmine.SpyObj<Router>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['start']);

        await TestBed.configureTestingModule({
            imports: [MainPageComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: TimerService, useValue: timerServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have correct team information', () => {
        expect(component.teamInfo.number).toBe(TEAM_NUMBER);
        expect(component.teamInfo.members).toContain('Jamoussi Ilyes');
    });

    it('should have correct game title', () => {
        expect(component.gameTitle).toBe('Find the Difference');
    });

    describe('Navigation', () => {
        it('should navigate to join game and start timer', () => {
            component.navigateToJoinGame();
            expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.joinSession]);
            expect(timerServiceSpy.start).toHaveBeenCalled();
        });

        it('should navigate to create game', () => {
            component.navigateToCreateGame();
            expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.gameSessionCreation]);
        });

        it('should navigate to game management', () => {
            component.navigateToGameManagement();
            expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.gameManagement]);
        });
    });
});
