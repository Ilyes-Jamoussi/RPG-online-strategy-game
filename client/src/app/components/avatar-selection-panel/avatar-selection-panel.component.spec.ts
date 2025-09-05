import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarSelectionPanelComponent } from './avatar-selection-panel.component';

@Component({
    selector: 'app-avatar-animated-display',
    template: '',
})
class MockAvatarAnimatedDisplayComponent {}

@Component({
    selector: 'app-avatar-grid',
    template: '',
})
class MockAvatarGridComponent {}

describe('AvatarSelectionPanelComponent', () => {
    let component: AvatarSelectionPanelComponent;
    let fixture: ComponentFixture<AvatarSelectionPanelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarSelectionPanelComponent],
            declarations: [MockAvatarAnimatedDisplayComponent, MockAvatarGridComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AvatarSelectionPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
