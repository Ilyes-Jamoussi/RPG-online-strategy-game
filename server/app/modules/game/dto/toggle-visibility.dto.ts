import * as commonDto from '@common/dto/game-store/toggle-visibility.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleVisibilityDto implements commonDto.ToggleVisibilityDto {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    readonly visibility: boolean;
}
