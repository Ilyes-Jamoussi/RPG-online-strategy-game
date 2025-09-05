import { GameSessionService } from '@app/modules/game-session/services/game-session.service';
import { Module } from '@nestjs/common';
import { SessionGateway } from './gateways/session.gateway';
import { SessionService } from './services/session.service';

@Module({
    providers: [SessionService, SessionGateway, GameSessionService],
})
export class SessionModule {}
