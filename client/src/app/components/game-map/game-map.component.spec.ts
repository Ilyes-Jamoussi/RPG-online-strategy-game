import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { ItemType } from '@common/enums/item-type.enum';
import { MapSize } from '@common/enums/map-size.enum';
import { TileType } from '@common/enums/tile-type.enum';
import { Tile } from '@common/interfaces/tile.interface';
import { GameMapComponent } from './game-map.component';

@Component({
    selector: 'app-tile',
    template: '',
    standalone: true,
})
class MockTileComponent {}

describe('GameMapComponent', () => {
    let component: GameMapComponent;
    let fixture: ComponentFixture<GameMapComponent>;
    let gameEditorService: jasmine.SpyObj<GameEditorService>;
    const mockGrid = signal<Tile[][]>([[]]);

    beforeEach(async () => {
        gameEditorService = jasmine.createSpyObj(
            'GameEditorService',
            ['placeActiveTileTypeAt', 'resetTileToSand', 'moveItem', 'placeActiveItemAt', 'returnItemToContainer'],
            {
                grid: mockGrid,
                mapSize: MapSize.Small,
            },
        );

        await TestBed.configureTestingModule({
            imports: [GameMapComponent, MockTileComponent],
            providers: [{ provide: GameEditorService, useValue: gameEditorService }],
        }).compileComponents();

        fixture = TestBed.createComponent(GameMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get grid from game editor service', () => {
        expect(component.grid).toBe(mockGrid);
    });

    it('should get map size from game editor service', () => {
        expect(component.mapSize).toBe(MapSize.Small);
    });

    it('should track by index', () => {
        expect(component.trackByIndex(5)).toBe(5);
    });

    describe('mouse events', () => {
        it('should handle mouse down', () => {
            component.onMouseDown({ button: 0 } as MouseEvent);
            component.onTileHover(0, 0);
            expect(gameEditorService.placeActiveTileTypeAt).toHaveBeenCalledWith(0, 0);
        });

        it('should handle right mouse down', () => {
            component.onMouseDown({ button: 2 } as MouseEvent);
            component.onTileHover(0, 0);
            expect(gameEditorService.resetTileToSand).toHaveBeenCalledWith(0, 0);
        });

        it('should handle mouse up', () => {
            component.onMouseDown({ button: 0 } as MouseEvent);
            component.onMouseUp();
            component.onTileHover(0, 0);
            expect(gameEditorService.placeActiveTileTypeAt).not.toHaveBeenCalled();
        });
    });

    describe('tile interactions', () => {
        it('should place tile on click', () => {
            component.onTileClicked(1, 2);
            expect(gameEditorService.placeActiveTileTypeAt).toHaveBeenCalledWith(1, 2);
        });

        it('should reset tile on right click', () => {
            component.onTileRightClicked(1, 2);
            expect(gameEditorService.resetTileToSand).toHaveBeenCalledWith(1, 2);
        });
    });

    describe('drag and drop', () => {
        it('should handle item drag start', () => {
            component.onItemDragStart(1, 2);
            component.onTileDrop(3, 4);
            expect(gameEditorService.moveItem).toHaveBeenCalledWith(1, 2, 3, 4);
        });

        it('should place new item when no drag in progress', () => {
            component.onTileDrop(1, 2);
            expect(gameEditorService.placeActiveItemAt).toHaveBeenCalledWith(1, 2);
        });

        it('should return item to container on drag end', () => {
            const mockTile: Tile = { type: TileType.Sand, item: ItemType.CriticalHealthAttackBoost };
            mockGrid.set([[mockTile]]);

            component.onItemDragStart(0, 0);
            component.onDragEnd();

            expect(gameEditorService.returnItemToContainer).toHaveBeenCalledWith(0, 0, ItemType.CriticalHealthAttackBoost);
        });

        it('should handle drag end when no item is being dragged', () => {
            component.onDragEnd();
            expect(gameEditorService.returnItemToContainer).not.toHaveBeenCalled();
        });

        it('should handle drag end when dragged tile has no item', () => {
            const mockTile: Tile = { type: TileType.Sand, item: null };
            mockGrid.set([[mockTile]]);

            component.onItemDragStart(0, 0);
            component.onDragEnd();

            expect(gameEditorService.returnItemToContainer).not.toHaveBeenCalled();
        });
    });

    it('should prevent context menu', () => {
        const event = { preventDefault: jasmine.createSpy() } as unknown as MouseEvent;
        component.onContextMenu(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
