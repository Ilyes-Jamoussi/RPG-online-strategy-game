import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { ItemType } from '@common/enums/item-type.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { ItemsContainerComponent } from './items-container.component';

describe('ItemsContainerComponent', () => {
    let component: ItemsContainerComponent;
    let fixture: ComponentFixture<ItemsContainerComponent>;
    let gameEditorService: jasmine.SpyObj<GameEditorService>;
    const mockContainers = signal<ItemContainer[]>([
        { item: ItemType.CriticalHealthAttackBoost, count: 1 },
        { item: ItemType.CriticalHealthAttackBoost, count: 0 },
    ]);

    beforeEach(async () => {
        gameEditorService = jasmine.createSpyObj('GameEditorService', ['setActiveItem'], {
            itemContainers: mockContainers,
        });

        await TestBed.configureTestingModule({
            imports: [ItemsContainerComponent],
            providers: [{ provide: GameEditorService, useValue: gameEditorService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemsContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get item containers from game editor service', () => {
        expect(component.itemContainers).toBe(mockContainers);
    });

    it('should set active item on drag start', () => {
        const event = new DragEvent('dragstart');
        component.onDragStart(event, ItemType.CriticalHealthAttackBoost);
        expect(gameEditorService.setActiveItem).toHaveBeenCalledWith(ItemType.CriticalHealthAttackBoost);
    });

    it('should get correct item image URL', () => {
        const url = component.getItemImageUrl(ItemType.CriticalHealthAttackBoost);
        expect(url).toBe('assets/items/critical-health-attack-boost.png');
    });

    describe('isEmpty', () => {
        it('should return true when count is 0', () => {
            expect(component.isEmpty({ item: ItemType.CriticalHealthAttackBoost, count: 0 })).toBeTrue();
        });

        it('should return false when count is greater than 0', () => {
            expect(component.isEmpty({ item: ItemType.CriticalHealthAttackBoost, count: 1 })).toBeFalse();
        });
    });
});
