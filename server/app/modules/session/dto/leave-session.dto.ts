import { AvatarName } from '@common/enums/avatar-name.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class LeaveSessionDto {
    @ApiProperty()
    @IsString()
    readonly sessionId: string;

    @ApiProperty()
    @IsString()
    readonly playerName: string;

    @ApiProperty()
    @IsEnum(AvatarName)
    readonly playerAvatar: AvatarName;
}

export class SessionLeftDto {
    @ApiProperty()
    @IsString()
    readonly sessionId: string;

    @ApiProperty()
    @IsString()
    readonly playerName: string;

    @ApiProperty()
    @IsEnum(AvatarName)
    readonly playerAvatar: AvatarName;
}
