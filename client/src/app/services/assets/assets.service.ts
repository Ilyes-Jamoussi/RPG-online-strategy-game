import { Injectable } from '@angular/core';
import { AVATAR_ANIMATED_PATH, AVATAR_STATIC_PATH, DICE_PATH, ITEM_PATH, TILE_PATH } from '@app/constants/assets-paths.constants';
import { AvatarName } from '@common/enums/avatar-name.enum';
import { DiceType } from '@common/enums/dice-type.enum';
import { ItemType } from '@common/enums/item-type.enum';
import { DoorState, TileType } from '@common/enums/tile-type.enum';

@Injectable({ providedIn: 'root' })
export class AssetsService {
    getAvatarStaticImage(avatarName: AvatarName | null): string {
        if (!avatarName) return '';
        return `${AVATAR_STATIC_PATH}/${avatarName.toLowerCase()}.png`;
    }

    getAvatarAnimatedImage(avatarName: AvatarName | null): string {
        if (!avatarName) return '';
        return `${AVATAR_ANIMATED_PATH}/${avatarName.toLowerCase()}.gif`;
    }

    getDiceImage(diceType: DiceType): string {
        return `${DICE_PATH}/${diceType.toLowerCase()}.svg`;
    }

    getTileImage(tileType: TileType, doorState?: DoorState): string {
        if (tileType === TileType.Door && doorState) {
            return `${TILE_PATH}/door-${doorState.toLowerCase()}.png`;
        }
        return `${TILE_PATH}/${tileType.toLowerCase()}.png`;
    }

    getItemImage(itemType: ItemType | null): string {
        if (!itemType) return '';
        return `${ITEM_PATH}/${itemType.toLowerCase()}.png`;
    }
}
