import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectPaletteComponent } from './object-palette.component';

describe('ObjectPaletteComponent', () => {
    let component: ObjectPaletteComponent;
    let fixture: ComponentFixture<ObjectPaletteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ObjectPaletteComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ObjectPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
