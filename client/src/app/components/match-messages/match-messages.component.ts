import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-match-messages',
    templateUrl: './match-messages.component.html',
    styleUrls: ['./match-messages.component.scss'],
    standalone: true,
    imports: [MatIconModule],
})
export class MatchMessagesComponent {}
