import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationDisplayComponent } from '@app/components/notification-display/notification-display.component';
import { ToastNotificationComponent } from '@app/components/toast-notification/toast-notification.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, NotificationDisplayComponent, ToastNotificationComponent],
})
export class AppComponent {
    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}
