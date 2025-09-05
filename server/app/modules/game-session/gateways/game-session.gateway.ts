import { GameSessionService } from '@app/modules/game-session/services/game-session.service';
import { SessionService } from '@app/modules/session/services/session.service';
import { successResponse } from '@app/utils/socket-response.util';
import { GameSessionEvents } from '@common/constants/game-session-events';
import { StartTurnDto } from '@common/dto/game-session/turn-started.dto';
import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({
    cors: true,
})
@Injectable()
export class GameSessionGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer() private server: Server;
    private readonly logger = new Logger(GameSessionGateway.name);

    constructor(
        private readonly gameSessionService: GameSessionService,
        private readonly sessionService: SessionService,
    ) {}

    @SubscribeMessage(GameSessionEvents.StartTurn)
    startTurn(socket: Socket, data: StartTurnDto): void {
        this.gameSessionService.startTurn(data.sessionId, socket.id);
        const players = this.gameSessionService.getPlayers(data.sessionId);
        this.server.to(data.sessionId).emit(GameSessionEvents.TurnStarted, successResponse({ players }));
    }
    handleConnection(socket: Socket) {
        this.logger.log(`[CONNECTION] Player ${socket.id} connected to game session`);
    }

    handleDisconnect(socket: Socket) {
        this.logger.log(`[DISCONNECT] Player ${socket.id} disconnected from game session`);
    }

    afterInit() {
        this.logger.log('Game Session Gateway initialized');
    }
}
