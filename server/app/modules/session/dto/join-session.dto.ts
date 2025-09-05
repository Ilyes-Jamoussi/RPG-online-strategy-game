import * as commonDto from '@common/dto/session/join-session.dto';
import { Player } from '@common/models/player.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinSessionDto implements commonDto.JoinSessionDto {
    @ApiProperty()
    @IsString()
    readonly sessionId: string;

    @ApiProperty()
    // @IsObject()
    readonly player: Player;
}
