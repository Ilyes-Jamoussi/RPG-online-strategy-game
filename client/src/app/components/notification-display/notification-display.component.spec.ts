import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { NotificationService } from '@app/services/notification/notification.service';
import { NotificationDisplayComponent } from './notification-display.component';

describe('NotificationDisplayComponent', () => {
    let component: NotificationDisplayComponent;
    let fixture: ComponentFixture<NotificationDisplayComponent>;
    let notificationService: jasmine.SpyObj<NotificationService>;
    let router: jasmine.SpyObj<Router>;

    const mockErrorNotification = {
        type: 'error',
        title: 'Error Title',
        message: 'Error Message',
    };

    const mockVictoryNotification = {
        type: 'victory',
        title: 'Victory Title',
        message: 'Victory Message',
    };

    beforeEach(async () => {
        notificationService = jasmine.createSpyObj('NotificationService', ['reset'], {
            notification: signal(mockErrorNotification),
        });
        router = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [NotificationDisplayComponent, MatIconModule],
            providers: [
                { provide: NotificationService, useValue: notificationService },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display error notification correctly', () => {
        const card = fixture.debugElement.query(By.css('.notification-card'));
        const title = fixture.debugElement.query(By.css('.notification-title'));
        const message = fixture.debugElement.query(By.css('.notification-message'));
        const icon = fixture.debugElement.query(By.css('.material-icons'));

        expect(card.classes['error']).toBeTruthy();
        expect(title.nativeElement.textContent).toBe(mockErrorNotification.title);
        expect(message.nativeElement.textContent).toBe(mockErrorNotification.message);
        expect(icon.nativeElement.textContent).toBe('error_outline');
    });

    it('should display victory notification correctly', () => {
        // @ts-ignore - Accessing private property for testing
        notificationService.notification = signal(mockVictoryNotification);
        fixture.detectChanges();

        const card = fixture.debugElement.query(By.css('.notification-card'));
        const title = fixture.debugElement.query(By.css('.notification-title'));
        const message = fixture.debugElement.query(By.css('.notification-message'));
        const icon = fixture.debugElement.query(By.css('.material-icons'));

        expect(card.classes['victory']).toBeTruthy();
        expect(title.nativeElement.textContent).toBe(mockVictoryNotification.title);
        expect(message.nativeElement.textContent).toBe(mockVictoryNotification.message);
        expect(icon.nativeElement.textContent).toBe('emoji_events');
    });

    it('should navigate to home and reset notification when clicking home button', () => {
        const homeButton = fixture.debugElement.query(By.css('.notification-button'));
        homeButton.triggerEventHandler('click', null);

        expect(notificationService.reset).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([ROUTES.home]);
    });

    it('should not display anything when notification is null', () => {
        // @ts-ignore - Accessing private property for testing
        notificationService.notification = signal(null);
        fixture.detectChanges();

        const container = fixture.debugElement.query(By.css('.notification-container'));
        expect(container).toBeFalsy();
    });
});
