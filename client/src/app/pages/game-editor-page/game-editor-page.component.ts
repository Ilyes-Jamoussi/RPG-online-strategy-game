import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { GameMapComponent } from '@app/components/game-map/game-map.component';
import { ItemsContainerComponent } from '@app/components/items-container/items-container.component';
import { TileToolboxComponent } from '@app/components/tile-toolbox/tile-toolbox.component';
import { ROUTES } from '@app/constants/routes.constants';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { GameStoreService } from '@app/services/game-store/game-store.service';
import { MapSize } from '@common/enums/map-size.enum';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-game-editor-page',
    templateUrl: './game-editor-page.component.html',
    styleUrls: ['./game-editor-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        GameMapComponent,
        TileToolboxComponent,
        ItemsContainerComponent,
    ],
})
export class GameEditorPageComponent implements OnInit {
    currentMapSize: MapSize;

    name = new FormControl<string>('');
    description = new FormControl<string>('');

    constructor(
        public gameEditorService: GameEditorService,
        private gameStoreService: GameStoreService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.initializeEditor();

        // Initialiser les valeurs des champs avec celles du service
        this.name.setValue(this.gameEditorService.name);
        this.description.setValue(this.gameEditorService.description);

        // Synchroniser les changements des champs avec le service
        this.name.valueChanges.subscribe((value) => {
            if (value !== null) {
                this.gameEditorService.setName(value);
            }
        });

        this.description.valueChanges.subscribe((value) => {
            if (value !== null) {
                this.gameEditorService.setDescription(value);
            }
        });
    }

    onResetMap(): void {
        this.gameEditorService.resetGrid();
    }

    async onSaveMap(): Promise<void> {
        await this.captureGamePreviewImage();

        this.gameEditorService.setName(this.name.value ?? '');
        this.gameEditorService.setDescription(this.description.value ?? '');

        const gameDto = this.gameEditorService.saveGame();

        if (!gameDto) {
            return;
        }

        this.gameStoreService.createGame(gameDto).subscribe({
            next: () => {
                this.gameEditorService.setName('');
                this.gameEditorService.setDescription('');
                this.router.navigate([ROUTES.gameManagement]);
            },
        });
    }

    getGridDimensions(): number {
        return this.currentMapSize;
    }

    async captureGamePreviewImage(): Promise<void> {
        const element = document.getElementById('map-capture');
        if (!element) return;

        const canvas = await html2canvas(element);
        const previewImageBase64 = canvas.toDataURL('image/png');

        this.gameEditorService.setCapturedImage(previewImageBase64);
    }

    private initializeEditor(): void {
        this.currentMapSize = this.gameEditorService.mapSize;
    }
}
