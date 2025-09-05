import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFormPanelComponent } from './character-form-panel.component';

describe('CharacterFormPanelComponent', () => {
    let component: CharacterFormPanelComponent;
    let fixture: ComponentFixture<CharacterFormPanelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CharacterFormPanelComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CharacterFormPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
