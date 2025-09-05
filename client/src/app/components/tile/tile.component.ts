import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemType } from '@common/enums/item-type.enum';
import { Tile } from '@common/interfaces/tile.interface';

const ANIMATION_DURATION = 500; // milliseconds

@Component({
    selector: 'app-tile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
    @Input() tile!: Tile;
    @Input() x!: number;
    @Input() y!: number;

    @Output() tileClick = new EventEmitter<void>();
    @Output() tileHover = new EventEmitter<void>();
    @Output() tileDrop = new EventEmitter<void>();
    @Output() tileRightClick = new EventEmitter<void>();
    @Output() itemDragStart = new EventEmitter<void>();
    @Output() itemDragEnd = new EventEmitter<void>();

    isDragOver = false;
    isPlacing = false;
    isDragging = false;

    onMouseDown(event: MouseEvent): void {
        event.preventDefault();
        if (event.button === 2) {
            // Right click
            this.tileRightClick.emit();
        } else {
            this.tileClick.emit();
            this.tileHover.emit();
        }
    }

    onItemMouseDown(event: MouseEvent): void {
        if (event.button !== 2) {
            // Only stop propagation for left click
            event.stopPropagation();
        }
    }

    onMouseEnter(): void {
        this.tileHover.emit();
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver = true;
    }

    onDragLeave(): void {
        this.isDragOver = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragOver = false;
        this.isPlacing = true;
        this.tileDrop.emit();
        // Reset isPlacing after animation completes
        setTimeout(() => {
            this.isPlacing = false;
        }, ANIMATION_DURATION);
    }

    onItemDragStart(event: DragEvent, item: ItemType): void {
        event.stopPropagation();
        this.isDragging = true;
        this.itemDragStart.emit();
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', item);
            event.dataTransfer.effectAllowed = 'move';
        }
    }

    onItemDragEnd(): void {
        this.isDragging = false;
        this.itemDragEnd.emit();
    }

    getTileBackgroundImage(): string {
        if (this.tile.type === 'door') {
            const state = this.tile.doorState === 'open' ? 'open-door' : 'closed-door';
            return `assets/tiles/${state}.png`;
        }
        return `assets/tiles/${this.tile.type}.png`;
    }

    getPlacedItemImage(): string | null {
        return this.tile.item ? `assets/items/${this.tile.item}.png` : null;
    }
}
