import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { ItemType } from '@common/enums/item-type.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';

@Component({
    selector: 'app-items-container',
    imports: [CommonModule],
    templateUrl: './items-container.component.html',
    styleUrl: './items-container.component.scss',
})
export class ItemsContainerComponent {
    constructor(private gameEditorService: GameEditorService) {}

    get itemContainers(): Signal<ItemContainer[]> {
        return this.gameEditorService.itemContainers;
    }

    onDragStart(event: DragEvent, item: ItemType): void {
        this.gameEditorService.setActiveItem(item);
    }

    getItemImageUrl(item: ItemType): string {
        return `assets/items/${item}.png`;
    }

    isEmpty(item: ItemContainer): boolean {
        return !item.count;
    }
}
