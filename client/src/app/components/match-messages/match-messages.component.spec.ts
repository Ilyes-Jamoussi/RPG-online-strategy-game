import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatchMessagesComponent } from './match-messages.component';

describe('MatchMessagesComponent', () => {
    let component: MatchMessagesComponent;
    let fixture: ComponentFixture<MatchMessagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatchMessagesComponent, MatIconModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MatchMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
