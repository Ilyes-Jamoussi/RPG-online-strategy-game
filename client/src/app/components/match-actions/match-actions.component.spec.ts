import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchActionsComponent } from './match-actions.component';

describe('MatchActionsComponent', () => {
    let component: MatchActionsComponent;
    let fixture: ComponentFixture<MatchActionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatchActionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MatchActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('event emitters', () => {
        it('should emit endTurn event', () => {
            const spy = spyOn(component.endTurn, 'emit');
            component.endTurn.emit();
            expect(spy).toHaveBeenCalled();
        });

        it('should emit action event', () => {
            const spy = spyOn(component.action, 'emit');
            component.action.emit();
            expect(spy).toHaveBeenCalled();
        });

        it('should emit abandon event', () => {
            const spy = spyOn(component.abandon, 'emit');
            component.abandon.emit();
            expect(spy).toHaveBeenCalled();
        });
    });
});
