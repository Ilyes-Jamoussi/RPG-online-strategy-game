import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-match-actions',
    templateUrl: './match-actions.component.html',
    styleUrls: ['./match-actions.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class MatchActionsComponent {
    @Output() endTurn = new EventEmitter<void>();
    @Output() action = new EventEmitter<void>();
    @Output() abandon = new EventEmitter<void>();
}
