import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes.constants';
import { GameEditorService } from '@app/services/game-editor/game-editor.service';
import { GameStoreService } from '@app/services/game-store/game-store.service';
import { MapSize } from '@common/enums/map-size.enum';
import { of } from 'rxjs';
import { GameEditorPageComponent } from './game-editor-page.component';

describe('GameEditorPageComponent', () => {
    let component: GameEditorPageComponent;
    let fixture: ComponentFixture<GameEditorPageComponent>;
    let gameEditorServiceSpy: jasmine.SpyObj<GameEditorService>;
    let gameStoreServiceSpy: jasmine.SpyObj<GameStoreService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        gameEditorServiceSpy = jasmine.createSpyObj('GameEditorService', ['setName', 'setDescription', 'resetGrid', 'saveGame', 'setCapturedImage'], {
            mapSize: MapSize.Medium,
            name: 'Test Game',
            description: 'Test Description',
        });

        gameStoreServiceSpy = jasmine.createSpyObj('GameStoreService', ['createGame']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [GameEditorPageComponent],
            providers: [
                { provide: GameEditorService, useValue: gameEditorServiceSpy },
                { provide: GameStoreService, useValue: gameStoreServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameEditorPageComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize editor with correct values', () => {
        fixture.detectChanges();
        expect(component.currentMapSize).toBe(MapSize.Medium);
        expect(component.name.value).toBe('Test Game');
        expect(component.description.value).toBe('Test Description');
    });

    it('should update name in service when name control changes', () => {
        fixture.detectChanges();
        const newName = 'New Game Name';
        component.name.setValue(newName);
        expect(gameEditorServiceSpy.setName).toHaveBeenCalledWith(newName);
    });

    it('should update description in service when description control changes', () => {
        fixture.detectChanges();
        const newDescription = 'New Description';
        component.description.setValue(newDescription);
        expect(gameEditorServiceSpy.setDescription).toHaveBeenCalledWith(newDescription);
    });

    it('should reset grid when onResetMap is called', () => {
        component.onResetMap();
        expect(gameEditorServiceSpy.resetGrid).toHaveBeenCalled();
    });

    it('should return correct grid dimensions', () => {
        fixture.detectChanges();
        expect(component.getGridDimensions()).toBe(MapSize.Medium);
    });

    describe('onSaveMap', () => {
        let mockGameDto: any;

        beforeEach(() => {
            mockGameDto = { name: 'Test Game', description: 'Test Description' };
            gameEditorServiceSpy.saveGame.and.returnValue(mockGameDto);
            gameStoreServiceSpy.createGame.and.returnValue(of(undefined));

            // Mock html2canvas
            const mockCanvas = {
                toDataURL: () => 'data:image/png;base64,test',
            };
            spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
            // @ts-ignore
            global.html2canvas = async () => Promise.resolve(mockCanvas);
        });

        it('should save game and navigate to management page on success', async () => {
            await component.onSaveMap();

            expect(gameEditorServiceSpy.setName).toHaveBeenCalledWith(component.name.value ?? '');
            expect(gameEditorServiceSpy.setDescription).toHaveBeenCalledWith(component.description.value ?? '');
            expect(gameEditorServiceSpy.saveGame).toHaveBeenCalled();
            expect(gameStoreServiceSpy.createGame).toHaveBeenCalledWith(mockGameDto);
            expect(routerSpy.navigate).toHaveBeenCalledWith([ROUTES.gameManagement]);
        });

        it('should not proceed if saveGame returns null', async () => {
            gameEditorServiceSpy.saveGame.and.returnValue(null);
            await component.onSaveMap();
            expect(gameStoreServiceSpy.createGame).not.toHaveBeenCalled();
        });

        it('should handle missing map element during capture', async () => {
            spyOn(document, 'getElementById').and.returnValue(null);
            await component.captureGamePreviewImage();
            expect(gameEditorServiceSpy.setCapturedImage).not.toHaveBeenCalled();
        });
    });

    it('should handle null values in form controls', () => {
        component.name = new FormControl<string | null>(null);
        component.description = new FormControl<string | null>(null);
        fixture.detectChanges();

        component.name.setValue(null);
        component.description.setValue(null);

        expect(gameEditorServiceSpy.setName).not.toHaveBeenCalled();
        expect(gameEditorServiceSpy.setDescription).not.toHaveBeenCalled();
    });
});
