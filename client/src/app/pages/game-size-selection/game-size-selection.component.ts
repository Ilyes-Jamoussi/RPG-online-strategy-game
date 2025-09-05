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
            name: 'Petite',
            size: MapSize.Small,
            gridSize: MapSize.Small,
            maxPlayers: '2 joueurs',
            items: 2,
        },
        {
            name: 'Moyenne',
            size: MapSize.Medium,
            gridSize: MapSize.Medium,
            maxPlayers: '2 à 4 joueurs',
            items: 4,
        },
        {
            name: 'Grande',
            size: MapSize.Large,
            gridSize: MapSize.Large,
            maxPlayers: '2 à 6 joueurs',
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
