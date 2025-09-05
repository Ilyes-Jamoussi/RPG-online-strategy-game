import * as commonDto from '@common/dto/session/start-game-session.dto';
import { GameSession } from '@common/models/game-session.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
export class StartGameSessionDto implements commonDto.StartGameSessionDto {
    @ApiProperty()
    @IsObject()
    readonly gameSession: GameSession;
}
