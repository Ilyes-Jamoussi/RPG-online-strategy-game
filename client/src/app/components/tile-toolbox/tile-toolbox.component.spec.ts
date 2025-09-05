import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { TileType } from '@common/enums/tile-type.enum';
import { TileToolboxComponent } from './tile-toolbox.component';

describe('TileToolboxComponent', () => {
    let component: TileToolboxComponent;
    let fixture: ComponentFixture<TileToolboxComponent>;
    let gameEditorService: jasmine.SpyObj<GameEditorService>;

    beforeEach(async () => {
        gameEditorService = jasmine.createSpyObj('GameEditorService', ['setActiveTileType'], {
            activeTileType: TileType.Wall,
        });

        await TestBed.configureTestingModule({
            imports: [TileToolboxComponent],
            providers: [{ provide: GameEditorService, useValue: gameEditorService }],
        }).compileComponents();

        fixture = TestBed.createComponent(TileToolboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with tile types', () => {
        expect(component.tileTypes).toEqual([TileType.Wall, TileType.Ice, TileType.Water, TileType.Door]);
    });

    it('should get active tile type from game editor service', () => {
        expect(component.activeTileType).toBe(TileType.Wall);
    });

    describe('isActive', () => {
        it('should return true when type matches active type', () => {
            expect(component.isActive(TileType.Wall)).toBeTrue();
        });

        it('should return false when type does not match active type', () => {
            expect(component.isActive(TileType.Ice)).toBeFalse();
        });
    });

    it('should set active tool in game editor service', () => {
        component.setActiveTool(TileType.Ice);
        expect(gameEditorService.setActiveTileType).toHaveBeenCalledWith(TileType.Ice);
    });

    describe('getImagePath', () => {
        it('should return special path for door', () => {
            expect(component.getImagePath(TileType.Door)).toBe('assets/tiles/closed-door.png');
        });

        it('should return regular path for other types', () => {
            expect(component.getImagePath(TileType.Wall)).toBe('assets/tiles/wall.png');
            expect(component.getImagePath(TileType.Ice)).toBe('assets/tiles/ice.png');
            expect(component.getImagePath(TileType.Water)).toBe('assets/tiles/water.png');
        });
    });
});
