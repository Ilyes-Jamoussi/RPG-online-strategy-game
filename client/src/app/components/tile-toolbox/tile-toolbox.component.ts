import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { TileType } from '@common/enums/tile-type.enum';

@Component({
    selector: 'app-tile-toolbox',
    imports: [CommonModule],
    templateUrl: './tile-toolbox.component.html',
    styleUrl: './tile-toolbox.component.scss',
})
export class TileToolboxComponent {
    readonly tileTypes: TileType[] = [TileType.Wall, TileType.Ice, TileType.Water, TileType.Door];

    constructor(private gameEditorService: GameEditorService) {}

    get activeTileType(): TileType {
        return this.gameEditorService.activeTileType;
    }

    isActive(type: TileType): boolean {
        return this.activeTileType === type;
    }

    setActiveTool(type: TileType): void {
        this.gameEditorService.setActiveTileType(type);
    }

    getImagePath(type: TileType): string {
        if (type === 'door') return 'assets/tiles/closed-door.png';
        return `assets/tiles/${type}.png`;
    }
}
