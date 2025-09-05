import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ItemType } from '@common/enums/item-type.enum';
import { DoorState, TileType } from '@common/enums/tile-type.enum';
import { Tile } from '@common/interfaces/tile.interface';
import { TileComponent } from './tile.component';

describe('TileComponent', () => {
    let component: TileComponent;
    let fixture: ComponentFixture<TileComponent>;

    const mockTile: Tile = {
        type: TileType.Sand,
        item: null,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TileComponent);
        component = fixture.componentInstance;
        component.tile = { ...mockTile };
        component.x = 0;
        component.y = 0;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('mouse events', () => {
        it('should emit tileClick and tileHover on left click', () => {
            const clickSpy = spyOn(component.tileClick, 'emit');
            const hoverSpy = spyOn(component.tileHover, 'emit');
            const event = new MouseEvent('mousedown', { button: 0 });

            component.onMouseDown(event);

            expect(clickSpy).toHaveBeenCalled();
            expect(hoverSpy).toHaveBeenCalled();
        });

        it('should emit tileRightClick on right click', () => {
            const rightClickSpy = spyOn(component.tileRightClick, 'emit');
            const event = new MouseEvent('mousedown', { button: 2 });

            component.onMouseDown(event);

            expect(rightClickSpy).toHaveBeenCalled();
        });

        it('should stop propagation on item left click', () => {
            const event = { button: 0, stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;
            component.onItemMouseDown(event);
            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should not stop propagation on item right click', () => {
            const event = { button: 2, stopPropagation: jasmine.createSpy() } as unknown as MouseEvent;
            component.onItemMouseDown(event);
            expect(event.stopPropagation).not.toHaveBeenCalled();
        });

        it('should emit tileHover on mouse enter', () => {
            const hoverSpy = spyOn(component.tileHover, 'emit');
            component.onMouseEnter();
            expect(hoverSpy).toHaveBeenCalled();
        });
    });

    describe('drag and drop', () => {
        it('should handle drag over', () => {
            const event = { preventDefault: jasmine.createSpy() } as unknown as DragEvent;
            component.onDragOver(event);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.isDragOver).toBeTrue();
        });

        it('should handle drag leave', () => {
            component.isDragOver = true;
            component.onDragLeave();
            expect(component.isDragOver).toBeFalse();
        });

        it('should handle drop', fakeAsync(() => {
            const event = { preventDefault: jasmine.createSpy() } as unknown as DragEvent;
            const dropSpy = spyOn(component.tileDrop, 'emit');

            component.onDrop(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.isDragOver).toBeFalse();
            expect(component.isPlacing).toBeTrue();
            expect(dropSpy).toHaveBeenCalled();

            tick(500);
            expect(component.isPlacing).toBeFalse();
        }));

        it('should handle item drag start', () => {
            const event = {
                stopPropagation: jasmine.createSpy(),
                dataTransfer: {
                    setData: jasmine.createSpy(),
                    effectAllowed: '',
                },
            } as unknown as DragEvent;
            const dragStartSpy = spyOn(component.itemDragStart, 'emit');

            component.onItemDragStart(event, ItemType.CriticalHealthAttackBoost);

            expect(event.stopPropagation).toHaveBeenCalled();
            expect(component.isDragging).toBeTrue();
            expect(dragStartSpy).toHaveBeenCalled();
            expect(event.dataTransfer?.setData).toHaveBeenCalledWith('text/plain', ItemType.CriticalHealthAttackBoost);
            expect(event.dataTransfer?.effectAllowed).toBe('move');
        });

        it('should handle item drag end', () => {
            const dragEndSpy = spyOn(component.itemDragEnd, 'emit');
            component.isDragging = true;

            component.onItemDragEnd();

            expect(component.isDragging).toBeFalse();
            expect(dragEndSpy).toHaveBeenCalled();
        });
    });

    describe('tile images', () => {
        it('should get correct background image for regular tile', () => {
            component.tile = { type: TileType.Sand, item: null };
            expect(component.getTileBackgroundImage()).toBe('assets/tiles/sand.png');
        });

        it('should get correct background image for closed door', () => {
            component.tile = { type: TileType.Door, doorState: DoorState.Closed, item: null };
            expect(component.getTileBackgroundImage()).toBe('assets/tiles/closed-door.png');
        });

        it('should get correct background image for open door', () => {
            component.tile = { type: TileType.Door, doorState: DoorState.Open, item: null };
            expect(component.getTileBackgroundImage()).toBe('assets/tiles/open-door.png');
        });

        it('should get correct item image when item is present', () => {
            component.tile = { type: TileType.Sand, item: ItemType.CriticalHealthAttackBoost };
            expect(component.getPlacedItemImage()).toBe('assets/items/critical-health-attack-boost.png');
        });

        it('should return null when no item is present', () => {
            component.tile = { type: TileType.Sand, item: null };
            expect(component.getPlacedItemImage()).toBeNull();
        });
    });
});
