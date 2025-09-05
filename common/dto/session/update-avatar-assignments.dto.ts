import { AvatarName } from '@common/enums/avatar-name.enum';
import { AvatarAssignment } from '@common/models/session.model';
export interface UpdateAvatarAssignmentsDto {
    sessionId: string;
    avatar: AvatarName;
}

export interface AvatarAssignmentsUpdatedDto {
    avatarAssignments: AvatarAssignment[];
}
