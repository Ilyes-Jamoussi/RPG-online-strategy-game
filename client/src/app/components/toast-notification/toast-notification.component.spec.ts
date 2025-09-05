import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService } from '@app/services/toast/toast.service';
import { ToastNotificationComponent } from './toast-notification.component';

const CIRCLE_CIRCUMFERENCE = 283;
const INITIAL_COUNTDOWN = 3;
const HALF_PROGRESS = 0.5;

describe('ToastNotificationComponent', () => {
    let component: ToastNotificationComponent;
    let fixture: ComponentFixture<ToastNotificationComponent>;
    let toastService: jasmine.SpyObj<ToastService>;

    const mockPlayerTurn = {
        playerName: 'Test Player',
    };

    beforeEach(async () => {
        toastService = jasmine.createSpyObj('ToastService', [], {
            message: signal(mockPlayerTurn),
            countdown: signal(INITIAL_COUNTDOWN),
        });

        await TestBed.configureTestingModule({
            imports: [ToastNotificationComponent, BrowserAnimationsModule, MatIconModule],
            providers: [{ provide: ToastService, useValue: toastService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ToastNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display player name', () => {
        const playerName = fixture.debugElement.query(By.css('.highlight'));
        expect(playerName.nativeElement.textContent).toBe(mockPlayerTurn.playerName);
    });

    it('should display countdown value', () => {
        const countdown = fixture.debugElement.query(By.css('.countdown'));
        expect(countdown.nativeElement.textContent).toBe(INITIAL_COUNTDOWN.toString());
    });

    it('should calculate progress offset correctly', () => {
        // @ts-ignore - Accessing protected method for testing
        const fullOffset = component.getProgressOffset(INITIAL_COUNTDOWN);
        expect(fullOffset).toBe(0);

        // @ts-ignore - Accessing protected method for testing
        const halfOffset = component.getProgressOffset(INITIAL_COUNTDOWN * HALF_PROGRESS);
        expect(halfOffset).toBe(CIRCLE_CIRCUMFERENCE * HALF_PROGRESS);
    });

    it('should update progress bar offset based on countdown', () => {
        const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
        expect(progressBar.attributes['style']).toContain('stroke-dashoffset: 0');

        // @ts-ignore - Accessing private property for testing
        toastService.countdown = signal(INITIAL_COUNTDOWN * HALF_PROGRESS);
        fixture.detectChanges();

        expect(progressBar.attributes['style']).toContain(`stroke-dashoffset: ${CIRCLE_CIRCUMFERENCE * HALF_PROGRESS}`);
    });

    it('should not display when message is null', () => {
        // @ts-ignore - Accessing private property for testing
        toastService.message = signal(null);
        fixture.detectChanges();

        const container = fixture.debugElement.query(By.css('.toast-container'));
        expect(container).toBeFalsy();
    });

    it('should display correct header text', () => {
        const headerText = fixture.debugElement.query(By.css('.player-turn-text'));
        expect(headerText.nativeElement.textContent).toBe('Changement de joueur');
    });

    it('should display turn message', () => {
        const turnText = fixture.debugElement.query(By.css('.turn-text'));
        expect(turnText.nativeElement.textContent).toBe('à vous de jouer !');
    });
});
