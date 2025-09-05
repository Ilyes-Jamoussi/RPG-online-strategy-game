import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusSelectorComponent } from './bonus-selector.component';

describe('BonusSelectorComponent', () => {
    let component: BonusSelectorComponent;
    let fixture: ComponentFixture<BonusSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BonusSelectorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BonusSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
