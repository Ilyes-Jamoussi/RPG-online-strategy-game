import * as commonDto from '@common/dto/session/create-session.dto';
import { MapSize } from '@common/enums/map-size.enum';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { Player } from '@common/models/player.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsObject, IsString } from 'class-validator';

export class CreateSessionDto implements commonDto.CreateSessionDto {
    @ApiProperty()
    @IsEnum(MapSize)
    readonly mapSize: MapSize;

    @ApiProperty()
    @IsObject()
    readonly player: Player;

    @ApiProperty()
    @IsArray()
    readonly map: Tile[][];

    @ApiProperty()
    @IsArray()
    readonly itemContainers: ItemContainer[];
}

export class SessionCreatedDto implements commonDto.SessionCreatedDto {
    @ApiProperty()
    @IsString()
    readonly sessionId: string;

    @ApiProperty()
    @IsString()
    readonly playerId: string;
}
