import * as commonDto from '@common/dto/session/join-avatar-selection.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class JoinAvatarSelectionDto implements commonDto.JoinAvatarSelectionDto {
    @ApiProperty()
    @IsString()
    readonly sessionId: string;
}

export class AvatarSelectionJoinedDto implements commonDto.AvatarSelectionJoinedDto {
    @ApiProperty()
    @IsString()
    readonly playerId: string;
}
