import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterNameInputComponent } from './character-name-input.component';

describe('CharacterNameInputComponent', () => {
    let component: CharacterNameInputComponent;
    let fixture: ComponentFixture<CharacterNameInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CharacterNameInputComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CharacterNameInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
