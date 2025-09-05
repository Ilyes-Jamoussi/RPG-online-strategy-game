import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { MapSize } from '@common/enums/map-size.enum';
import { GameSizeSelectionComponent } from './game-size-selection.component';

describe('GameSizeSelectionComponent', () => {
    let component: GameSizeSelectionComponent;
    let fixture: ComponentFixture<GameSizeSelectionComponent>;
    let gameEditorServiceSpy: jasmine.SpyObj<GameEditorService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        gameEditorServiceSpy = jasmine.createSpyObj('GameEditorService', ['setMapSize']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [GameSizeSelectionComponent],
            providers: [
                { provide: GameEditorService, useValue: gameEditorServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSizeSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have three game size options', () => {
        expect(component.gameSizes.length).toBe(3);
        expect(component.gameSizes[0].size).toBe(MapSize.Small);
        expect(component.gameSizes[1].size).toBe(MapSize.Medium);
        expect(component.gameSizes[2].size).toBe(MapSize.Large);
    });

    it('should have correct properties for each size option', () => {
        const smallOption = component.gameSizes[0];
        expect(smallOption.name).toBe('Petite');
        expect(smallOption.gridSize).toBe(MapSize.Small);
        expect(smallOption.maxPlayers).toBe('2 joueurs');
        expect(smallOption.items).toBe(2);
    });

    it('should set map size and navigate to editor on size select', () => {
        const selectedSize = component.gameSizes[0];
        component.onSizeSelect(selectedSize);
        expect(gameEditorServiceSpy.setMapSize).toHaveBeenCalledWith(selectedSize.size);
        expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.gameEditor]);
    });
});
