import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';

@Component({
    selector: 'app-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule],
})
export class GameCardComponent {
    @Input() game!: DisplayGameDto;
    @Input() isAdmin = false;

    @Output() startGame = new EventEmitter<string>();
    @Output() editGame = new EventEmitter<string>();
    @Output() deleteGame = new EventEmitter<string>();
    @Output() toggleVisibility = new EventEmitter<string>();

    onStartGame(): void {
        this.startGame.emit(this.game.id);
    }

    onEditGame(): void {
        this.editGame.emit(this.game.id);
    }

    onDeleteGame(): void {
        this.deleteGame.emit(this.game.id);
    }

    onToggleVisibility(): void {
        this.toggleVisibility.emit(this.game.id);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}
