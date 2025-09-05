import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { TileComponent } from '@app/components/tile/tile.component';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { MapSize } from '@common/enums/map-size.enum';
import { Tile } from '@common/interfaces/tile.interface';

@Component({
    selector: 'app-game-map',
    imports: [TileComponent, CommonModule],
    templateUrl: './game-map.component.html',
    styleUrl: './game-map.component.scss',
})
export class GameMapComponent {
    private mouseDown = false;
    private isRightClick = false;
    private draggedItemPosition: { x: number; y: number } | null = null;

    constructor(private gameEditorService: GameEditorService) {}

    get grid(): Signal<Tile[][]> {
        return this.gameEditorService.grid;
    }

    get mapSize(): MapSize {
        return this.gameEditorService.mapSize;
    }

    trackByIndex(index: number): number {
        return index;
    }

    onMouseUp(): void {
        this.mouseDown = false;
        this.isRightClick = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        this.isRightClick = event.button === 2;
    }

    onTileClicked(x: number, y: number): void {
        this.gameEditorService.placeActiveTileTypeAt(x, y);
    }

    onTileRightClicked(x: number, y: number): void {
        this.gameEditorService.resetTileToSand(x, y);
    }

    onTileHover(x: number, y: number): void {
        if (this.mouseDown) {
            if (this.isRightClick) {
                this.gameEditorService.resetTileToSand(x, y);
            } else {
                this.gameEditorService.placeActiveTileTypeAt(x, y);
            }
        }
    }

    onTileDrop(x: number, y: number): void {
        if (this.draggedItemPosition) {
            this.gameEditorService.moveItem(this.draggedItemPosition.x, this.draggedItemPosition.y, x, y);
            this.draggedItemPosition = null;
        } else {
            this.gameEditorService.placeActiveItemAt(x, y);
        }
    }

    onItemDragStart(x: number, y: number): void {
        this.draggedItemPosition = { x, y };
    }

    onDragEnd(): void {
        if (this.draggedItemPosition) {
            const tile = this.grid()[this.draggedItemPosition.y][this.draggedItemPosition.x];
            if (tile.item) {
                this.gameEditorService.returnItemToContainer(this.draggedItemPosition.x, this.draggedItemPosition.y, tile.item);
            }
            this.draggedItemPosition = null;
        }
    }

    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }
}
