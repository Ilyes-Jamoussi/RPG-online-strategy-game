import { CreateGameDto } from '@app/modules/game/dto/create-game.dto';
import { GameStoreGateway } from '@app/modules/game/gateways/game-store.gateway';
import { GameService } from '@app/modules/game/services/game.service';
import { DisplayGameDto } from '@common/dto/game-store/display-game.dto';
import { ToggleVisibilityDto } from '@common/dto/game-store/toggle-visibility.dto';
import { UpdateGameDto } from '@common/dto/game-store/update-game.dto';

import { GameInitializationDataDto } from '@common/dto/game-store/game-initialization-data.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Games')
@Controller('games')
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly gameStoreGateway: GameStoreGateway,
    ) {}

    @Get('displays')
    async getGamesDisplay(): Promise<DisplayGameDto[]> {
        return this.gameService.getGamesDisplay();
    }

    @Get(':id/initialization-data')
    async getGameInitializationData(@Param('id') id: string): Promise<GameInitializationDataDto> {
        return this.gameService.getGameInitializationData(id);
    }

    @Post()
    async createGame(@Body() dto: CreateGameDto): Promise<void> {
        const displayGame: DisplayGameDto = await this.gameService.createGame(dto);
        this.gameStoreGateway.emitGameCreated(displayGame);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch(':id')
    async updateGame(@Param('id') id: string, @Body() dto: UpdateGameDto): Promise<void> {
        const displayGame: DisplayGameDto = await this.gameService.updateGame(id, dto);
        this.gameStoreGateway.emitGameUpdated(displayGame);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch(':id/visibility')
    async toggleVisibility(@Param('id') id: string, @Body() dto: ToggleVisibilityDto): Promise<void> {
        await this.gameService.toggleVisibility(id, dto.visibility);
        this.gameStoreGateway.emitGameVisibilityToggled(id, dto.visibility);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteGame(@Param('id') id: string): Promise<void> {
        const deleted = await this.gameService.deleteGame(id);
        if (!deleted) throw new NotFoundException('Game not found');
        this.gameStoreGateway.emitGameDeleted(id);
    }
}
