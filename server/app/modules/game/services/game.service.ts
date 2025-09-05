import { CreateGameDto } from '@app/modules/game/dto/create-game.dto';
import { Game, GameDocument } from '@app/modules/game/models/game.schema';
import { getProjection } from '@app/utils/mongo.utils';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { GameInitializationDataDto } from '@common/dto/game-store/game-initialization-data.dto';
import { UpdateGameDto } from '@common/dto/game-store/update-game.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageService } from './image.service';

@Injectable()
export class GameService {
    constructor(
        @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
        private readonly imageService: ImageService,
    ) {}

    async createGame(dto: CreateGameDto): Promise<DisplayGameDto> {
        const { mapPreviewImage, ...gameData } = dto;
        const mapPreviewImageUrl = await this.imageService.saveImage(mapPreviewImage);

        const createdGame = await this.gameModel.create({
            ...gameData,
            mapPreviewImageUrl,
        });

        return this.toDisplayGameDto(createdGame);
    }

    async getGamesDisplay(): Promise<DisplayGameDto[]> {
        const games = await this.gameModel.find({}, getProjection('displayGameDto')).lean();
        return games.map((game) => this.toDisplayGameDto(game));
    }

    async getGameInitializationData(gameId: string): Promise<GameInitializationDataDto> {
        const game = await this.gameModel.findById(gameId, { map: 1, itemContainers: 1, size: 1 }).lean();
        if (!game) {
            throw new NotFoundException(`Game with id ${gameId} not found`);
        }

        return {
            map: game.map,
            itemContainers: game.itemContainers,
            mapSize: game.size,
        };
    }

    async deleteGame(id: string): Promise<boolean> {
        const game = await this.gameModel.findById(id, { mapPreviewImageUrl: 1 }).lean();
        if (!game) return false;

        const result = await this.gameModel.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            await this.imageService.deleteImage(game.mapPreviewImageUrl);
            return true;
        }
        return false;
    }

    async updateGame(id: string, updateGameDto: UpdateGameDto): Promise<DisplayGameDto> {
        const game = await this.gameModel.findById(id);
        if (!game) {
            throw new NotFoundException('Game not found');
        }

        const { mapPreviewImage, ...gameData } = updateGameDto;
        const updatedMapPreviewImageUrl = await this.imageService.replaceImage(mapPreviewImage, game.mapPreviewImageUrl);

        const updatedGame = await this.gameModel.findByIdAndUpdate(
            id,
            {
                ...gameData,
                mapPreviewImageUrl: updatedMapPreviewImageUrl,
                lastModified: new Date(),
            },
            { new: true },
        );

        return this.toDisplayGameDto(updatedGame);
    }

    async toggleVisibility(id: string, newVisibility: boolean): Promise<void> {
        const updated = await this.gameModel
            .findByIdAndUpdate(id, { $set: { visibility: newVisibility, lastModified: new Date() } }, { new: false })
            .lean();

        if (!updated) {
            throw new NotFoundException('Game not found');
        }
    }

    private toDisplayGameDto(game: GameDocument): DisplayGameDto {
        return {
            id: game._id.toString(),
            name: game.name,
            description: game.description,
            size: game.size,
            mapPreviewImageUrl: this.imageService.getImageUrl(game.mapPreviewImageUrl),
            lastModified: game.lastModified,
            visibility: game.visibility,
        };
    }
}
