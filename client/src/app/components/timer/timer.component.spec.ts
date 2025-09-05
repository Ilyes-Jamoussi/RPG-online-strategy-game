import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TimerService } from '@app/services/timer/timer.service';
import { TimerComponent } from './timer.component';

const SECONDS_IN_MINUTE = 60;
const CIRCLE_CIRCUMFERENCE = 283;
const DEFAULT_INITIAL_TIME = 30;
const ENDING_TIME_THRESHOLD = 5;
const HALF_PROGRESS = 0.5;
const EXTRA_SECONDS_SHORT = ENDING_TIME_THRESHOLD;
const EXTRA_SECONDS_LONG = 10;
const TEST_TIME_65 = SECONDS_IN_MINUTE + EXTRA_SECONDS_SHORT;
const TEST_TIME_130 = SECONDS_IN_MINUTE * 2 + EXTRA_SECONDS_LONG;
const TEST_TIME_45 = 45;

describe('TimerComponent', () => {
    let component: TimerComponent;
    let fixture: ComponentFixture<TimerComponent>;
    let timerService: jasmine.SpyObj<TimerService>;

    beforeEach(async () => {
        timerService = jasmine.createSpyObj('TimerService', [], {
            timeRemaining: signal(DEFAULT_INITIAL_TIME),
        });

        await TestBed.configureTestingModule({
            imports: [TimerComponent],
            providers: [{ provide: TimerService, useValue: timerService }],
        }).compileComponents();

        fixture = TestBed.createComponent(TimerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should format time correctly for minutes and seconds', () => {
        // @ts-ignore - Accessing protected method for testing
        expect(component.formatTime(TEST_TIME_65)).toBe('01:05');
        // @ts-ignore - Accessing protected method for testing
        expect(component.formatTime(TEST_TIME_130)).toBe('02:10');
        // @ts-ignore - Accessing protected method for testing
        expect(component.formatTime(TEST_TIME_45)).toBe('00:45');
    });

    it('should pad single digits with zeros', () => {
        // @ts-ignore - Accessing protected method for testing
        expect(component.formatTime(ENDING_TIME_THRESHOLD)).toBe('00:05');
        // @ts-ignore - Accessing protected method for testing
        expect(component.formatTime(SECONDS_IN_MINUTE * 2 + ENDING_TIME_THRESHOLD)).toBe('02:05');
    });

    it('should calculate progress offset correctly', () => {
        // @ts-ignore - Accessing protected method for testing
        const offset = component.getProgressOffset(DEFAULT_INITIAL_TIME);
        expect(offset).toBe(0);

        // @ts-ignore - Accessing protected method for testing
        const halfTimeOffset = component.getProgressOffset(DEFAULT_INITIAL_TIME * HALF_PROGRESS);
        expect(halfTimeOffset).toBe(CIRCLE_CIRCUMFERENCE * HALF_PROGRESS);
    });

    it('should display time in correct format', () => {
        const timerDisplay = fixture.debugElement.query(By.css('.timer-display'));
        expect(timerDisplay.nativeElement.textContent.trim()).toBe('00:30');
    });

    it('should add ending class when time is 5 seconds or less', () => {
        // @ts-ignore - Accessing private property for testing
        timerService.timeRemaining = signal(ENDING_TIME_THRESHOLD);
        fixture.detectChanges();

        const timerDisplay = fixture.debugElement.query(By.css('.timer-display'));
        expect(timerDisplay.classes['ending']).toBeTruthy();
    });

    it('should not have ending class when time is more than 5 seconds', () => {
        // @ts-ignore - Accessing private property for testing
        timerService.timeRemaining = signal(ENDING_TIME_THRESHOLD + 1);
        fixture.detectChanges();

        const timerDisplay = fixture.debugElement.query(By.css('.timer-display'));
        expect(timerDisplay.classes['ending']).toBeFalsy();
    });

    it('should update progress bar offset based on time remaining', () => {
        const progressBar = fixture.debugElement.query(By.css('.timer-progress-bar'));
        expect(progressBar.attributes['style']).toContain('stroke-dashoffset: 0');

        // @ts-ignore - Accessing private property for testing
        timerService.timeRemaining = signal(DEFAULT_INITIAL_TIME * HALF_PROGRESS);
        fixture.detectChanges();

        expect(progressBar.attributes['style']).toContain(`stroke-dashoffset: ${CIRCLE_CIRCUMFERENCE * HALF_PROGRESS}`);
    });
});
