import * as commonDto from '@common/dto/session/update-avatar-assignments.dto';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { AvatarAssignment } from '@common/models/session.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class UpdateAvatarAssignmentsDto implements commonDto.UpdateAvatarAssignmentsDto {
    @ApiProperty()
    @IsString()
    readonly sessionId: string;

    @ApiProperty()
    @IsEnum(AvatarName)
    readonly avatar: AvatarName;
}

export class AvatarAssignmentsUpdatedDto implements commonDto.AvatarAssignmentsUpdatedDto {
    @ApiProperty()
    @IsArray()
    readonly avatarAssignments: AvatarAssignment[];
}
