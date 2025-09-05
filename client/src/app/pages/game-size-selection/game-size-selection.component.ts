import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { MapSize } from '@common/enums/map-size.enum';

interface GameSizeOption {
    name: string;
    size: MapSize;
    gridSize: number;
    maxPlayers: string;
    items: number;
}

@Component({
    selector: 'app-game-size-selection',
    templateUrl: './game-size-selection.component.html',
    styleUrls: ['./game-size-selection.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class GameSizeSelectionComponent {
    readonly gameSizes: GameSizeOption[] = [
        {
            name: 'Small',
            size: MapSize.Small,
            gridSize: MapSize.Small,
            maxPlayers: '2 players',
            items: 2,
        },
        {
            name: 'Medium',
            size: MapSize.Medium,
            gridSize: MapSize.Medium,
            maxPlayers: '2 to 4 players',
            items: 4,
        },
        {
            name: 'Large',
            size: MapSize.Large,
            gridSize: MapSize.Large,
            maxPlayers: '2 to 6 players',
            items: 6,
        },
    ];

    constructor(
        private gameEditorService: GameEditorService,
        private router: Router,
    ) {}

    onSizeSelect(size: GameSizeOption): void {
        this.gameEditorService.setMapSize(size.size);
        this.router.navigate([ROUTES.gameEditor]);
    }
}
