import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { BoardTileComponent } from '@app/components/board-tile/board-tile.component';
import { CONTEXT_MENU_DELAY, TILE_MOVEMENT_COST } from '@app/constants/game-board.constants';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { PlayerService } from '@app/services/player/player.service';
import { BoardTile } from '@common/interfaces/board-tile.interface';
import { Position } from '@common/interfaces/position.interface';

@Component({
    selector: 'app-game-board',
    standalone: true,
    imports: [CommonModule, BoardTileComponent],
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
    protected contextMenuText: string | null = null;
    protected contextMenuPosition: { x: number; y: number } | null = null;

    constructor(
        private readonly gameSession: GameSessionService,
        private readonly playerService: PlayerService,
    ) {}

    get board(): Signal<BoardTile[][]> {
        return this.gameSession.board;
    }

    get isMyTurn(): boolean {
        return this.playerService.isMyTurn;
    }

    onLeftClick(position: Position): void {
        if (!this.isMyTurn) return;

        const tile = this.gameSession.getTileAt(position);
        if (!tile?.isReachable) return;

        // 🔜 move() sera appelée ici
    }

    onRightClick(event: MouseEvent, position: Position): void {
        event.preventDefault();
        const tile = this.gameSession.getTileAt(position);
        if (!tile) return;

        const occupant = this.gameSession.getTileOccupant(tile);
        const cost = TILE_MOVEMENT_COST[tile.baseTile.type];

        if (occupant) {
            this.contextMenuText = `Joueur: ${occupant.name}`;
        } else {
            this.contextMenuText = `Coût de déplacement: ${cost === Infinity ? '∞' : cost}`;
        }

        // Positionner le menu contextuel
        this.contextMenuPosition = {
            x: event.clientX,
            y: event.clientY,
        };

        // Cacher le menu après un délai
        setTimeout(() => {
            this.contextMenuText = null;
            this.contextMenuPosition = null;
        }, CONTEXT_MENU_DELAY);
    }

    onHover(position: Position): void {
        if (!this.isMyTurn) return;

        const tile = this.gameSession.getTileAt(position);
        if (!tile?.isReachable) return;

        this.gameSession.highlightReachablePathTo(position);
    }

    onHoverOut(): void {
        this.gameSession.clearPathHighlight();
    }

    trackByIndex(index: number): number {
        return index;
    }
}
