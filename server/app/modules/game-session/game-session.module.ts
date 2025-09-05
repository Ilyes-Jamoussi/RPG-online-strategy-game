import { SessionService } from '@app/modules/session/services/session.service';
import { Module } from '@nestjs/common';
import { GameSessionGateway } from './gateways/game-session.gateway';
import { GameSessionService } from './services/game-session.service';
@Module({
    providers: [GameSessionService, GameSessionGateway, SessionService],
})
export class GameSessionModule {}
