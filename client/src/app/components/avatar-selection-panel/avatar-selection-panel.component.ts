import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarAnimatedDisplayComponent } from '@app/components/avatar-animated-display/avatar-animated-display.component';
import { AvatarGridComponent } from '@app/components/avatar-grid/avatar-grid.component';

@Component({
    selector: 'app-avatar-selection-panel',
    imports: [CommonModule, AvatarAnimatedDisplayComponent, AvatarGridComponent],
    templateUrl: './avatar-selection-panel.component.html',
    styleUrls: ['./avatar-selection-panel.component.scss'],
})
export class AvatarSelectionPanelComponent {}
