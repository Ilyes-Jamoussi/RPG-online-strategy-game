import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { MapSize } from '@common/enums/map-size.enum';
import { GameCardComponent } from './game-card.component';

describe('GameCardComponent', () => {
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;

    const mockGame: DisplayGameDto = {
        id: 'game1',
        name: 'Test Game',
        visibility: true,
        lastModified: new Date('2024-03-15T11:30:00'),
        size: MapSize.Small,
        description: 'Test Description',
        mapPreviewImageUrl: 'assets/images/map-preview.png',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameCardComponent, MatIconModule],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardComponent);
        component = fixture.componentInstance;
        component.game = { ...mockGame };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('event emitters', () => {
        it('should emit startGame with game id', () => {
            const spy = spyOn(component.startGame, 'emit');
            component.onStartGame();
            expect(spy).toHaveBeenCalledWith('game1');
        });

        it('should emit editGame with game id', () => {
            const spy = spyOn(component.editGame, 'emit');
            component.onEditGame();
            expect(spy).toHaveBeenCalledWith('game1');
        });

        it('should emit deleteGame with game id', () => {
            const spy = spyOn(component.deleteGame, 'emit');
            component.onDeleteGame();
            expect(spy).toHaveBeenCalledWith('game1');
        });

        it('should emit toggleVisibility with game id', () => {
            const spy = spyOn(component.toggleVisibility, 'emit');
            component.onToggleVisibility();
            expect(spy).toHaveBeenCalledWith('game1');
        });
    });

    describe('formatDate', () => {
        it('should format date correctly', () => {
            const date = new Date('2024-03-15T10:30:00');
            const formattedDate = component.formatDate(date);
            expect(formattedDate).toMatch(/15 mars 2024.*10:30/);
        });
    });

    describe('admin functionality', () => {
        it('should initialize with isAdmin as false by default', () => {
            expect(component.isAdmin).toBeFalse();
        });

        it('should allow setting isAdmin to true', () => {
            component.isAdmin = true;
            expect(component.isAdmin).toBeTrue();
        });
    });
});
