import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedAvatarDisplayComponent } from './selected-avatar-display.component';

describe('SelectedAvatarDisplayComponent', () => {
    let component: SelectedAvatarDisplayComponent;
    let fixture: ComponentFixture<SelectedAvatarDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectedAvatarDisplayComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectedAvatarDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
