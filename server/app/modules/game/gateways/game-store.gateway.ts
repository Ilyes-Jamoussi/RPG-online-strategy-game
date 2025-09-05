import { successResponse } from '@app/utils/socket-response.util';
import { GameStoreEvents } from '@common/constants/game-store-events';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway({
    cors: true,
})
@Injectable()
export class GameStoreGateway {
    @WebSocketServer()
    private server: Server;

    emitGameCreated(game: DisplayGameDto): void {
        this.server.emit(GameStoreEvents.GameCreated, successResponse(game));
    }

    emitGameUpdated(game: DisplayGameDto): void {
        this.server.emit(GameStoreEvents.GameUpdated, successResponse(game));
    }

    emitGameDeleted(gameId: string): void {
        this.server.emit(GameStoreEvents.GameDeleted, successResponse({ id: gameId }));
    }

    emitGameVisibilityToggled(gameId: string, visibility: boolean): void {
        this.server.emit(GameStoreEvents.GameVisibilityToggled, successResponse({ id: gameId, visibility }));
    }
}
