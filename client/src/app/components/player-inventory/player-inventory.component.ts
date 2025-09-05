import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-player-inventory',
    templateUrl: './player-inventory.component.html',
    styleUrls: ['./player-inventory.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class PlayerInventoryComponent {
    // Pour le moment, nous avons juste deux emplacements vides
    protected slots = [null, null];
}
