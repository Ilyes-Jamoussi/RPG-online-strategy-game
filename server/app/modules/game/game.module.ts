import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './controllers/game.controller';
import { GameStoreGateway } from './gateways/game-store.gateway';
import { Game, gameSchema } from './models/game.schema';
import { GameService } from './services/game.service';
import { ImageService } from './services/image.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Game.name, schema: gameSchema }])],
    controllers: [GameController],
    providers: [GameService, ImageService, GameStoreGateway],
    exports: [GameService],
})
export class GameModule {}
