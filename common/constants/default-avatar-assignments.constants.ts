import { AvatarName } from '@common/enums/avatar-name.enum';
import { AvatarAssignment } from '@common/models/session.model';

export const DEFAULT_AVATAR_ASSIGNMENTS: AvatarAssignment[] = Object.values(AvatarName).map(
    (avatarName): AvatarAssignment => ({
        avatarName,
        chosenBy: null,
    }),
);
