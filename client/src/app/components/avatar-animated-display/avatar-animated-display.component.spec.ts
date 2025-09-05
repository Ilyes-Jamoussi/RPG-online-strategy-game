import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerService } from '@app/services/player/player.service';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { AvatarAnimatedDisplayComponent } from './avatar-animated-display.component';

describe('AvatarAnimatedDisplayComponent', () => {
    let component: AvatarAnimatedDisplayComponent;
    let fixture: ComponentFixture<AvatarAnimatedDisplayComponent>;
    let playerService: jasmine.SpyObj<PlayerService>;

    beforeEach(async () => {
        playerService = jasmine.createSpyObj('PlayerService', ['avatar']);

        await TestBed.configureTestingModule({
            imports: [AvatarAnimatedDisplayComponent],
            providers: [{ provide: PlayerService, useValue: playerService }],
        }).compileComponents();

        fixture = TestBed.createComponent(AvatarAnimatedDisplayComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return null when no avatar is selected', () => {
        playerService.avatar.and.returnValue(null);
        fixture.detectChanges();
        expect(component.selectedAvatar).toBeNull();
        expect(component.animatedAvatar).toBeNull();
    });

    it('should return correct avatar path when avatar is selected', () => {
        playerService.avatar.and.returnValue(AvatarName.Avatar1);
        fixture.detectChanges();
        expect(component.selectedAvatar).toBe(AvatarName.Avatar1);
        expect(component.animatedAvatar).toBe(`/assets/avatars/animated/${AvatarName.Avatar1}.gif`);
    });
});
