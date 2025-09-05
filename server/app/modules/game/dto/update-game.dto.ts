import * as commonDto from '@common/dto/game-store/update-game.dto';
import { ItemContainer } from '@common/interfaces/item-container.interface';
import { Tile } from '@common/interfaces/tile.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UpdateGameDto implements commonDto.UpdateGameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @ApiProperty({ type: 'array', items: { type: 'array', items: { type: 'object' } } })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Array)
    readonly map: Tile[][];

    @ApiProperty({ type: 'array', items: { type: 'object' } })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Array)
    readonly items: ItemContainer[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly mapPreviewImage: string;
}
