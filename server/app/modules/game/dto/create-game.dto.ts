import * as commonDto from '@common/dto/game-store/create-game.dto';
import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto implements commonDto.CreateGameDto {
    @ApiProperty({ enum: MapSize })
    @IsEnum(MapSize)
    @IsNotEmpty()
    readonly size: MapSize;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsArray()
    readonly map: Tile[][];

    @IsArray()
    readonly items: ItemContainer[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly mapPreviewImage: string;
}
