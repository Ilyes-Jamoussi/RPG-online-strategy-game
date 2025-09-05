import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssetsService } from '@app/services/assets/assets.service';
import { GameSessionService } from '@app/services/game-session/game-session.service';
import { DoorState } from '@common/enums/tile-type.enum';
import { BoardTile } from '@common/interfaces/board-tile.interface';
import { Position } from '@common/interfaces/position.interface';
import { Player } from '@common/models/player.model';

@Component({
    selector: 'app-board-tile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './board-tile.component.html',
    styleUrls: ['./board-tile.component.scss'],
})
export class BoardTileComponent {
    @Input() tile!: BoardTile;
    @Input() position!: Position;
    @Input() isMyTurn!: boolean;

    @Output() leftClick = new EventEmitter<Position>();
    @Output() rightClick = new EventEmitter<{ event: MouseEvent; position: Position }>();
    @Output() hover = new EventEmitter<Position>();
    @Output() hoverOut = new EventEmitter<void>();

    constructor(
        private readonly gameSession: GameSessionService,
        private readonly assets: AssetsService,
    ) {}

    get occupant(): Player | null {
        return this.gameSession.getTileOccupant(this.tile);
    }

    get avatarImageUrl(): string | null {
        return this.assets.getAvatarStaticImage(this.occupant?.avatar ?? null);
    }

    get tileImageUrl(): string {
        return this.assets.getTileImage(this.tile.baseTile.type, this.tile.baseTile.doorState as DoorState);
    }

    get itemImageUrl(): string {
        return this.assets.getItemImage(this.tile.baseTile.item);
    }

    get classes(): { [key: string]: boolean } {
        return {
            boardTile: true,
            reachable: this.tile.isReachable,
            inPath: this.tile.isInPath,
            // highlighted: this.tile.isHighlighted,
            // occupied: !!this.tile.occupantId,
            interactive: this.isMyTurn && this.tile.isReachable,
        };
    }

    onLeftClick(): void {
        if (this.isMyTurn) {
            this.leftClick.emit(this.position);
        }
    }

    onRightClick(event: MouseEvent): void {
        event.preventDefault();
        this.rightClick.emit({ event, position: this.position });
    }

    onHover(): void {
        if (this.isMyTurn) {
            this.hover.emit(this.position);
        }
    }

    onMouseLeave(): void {
        this.hoverOut.emit();
    }
}
