import { MapSize } from '@common/enums/map-size.enum';

export interface DisplayGameDto {
    readonly id: string;
    readonly name: string;
    readonly size: MapSize;
    readonly description: string;
    readonly mapPreviewImageUrl: string;
    readonly lastModified: Date;
    readonly visibility: boolean;
}
