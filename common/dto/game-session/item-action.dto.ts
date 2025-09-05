import { ItemType } from '@common/enums/item-type.enum';

export interface ItemPickupDto {
    sessionId: string;
    itemType: ItemType;
    discardedItemId?: string;
}

export interface ItemPickedUpDto {
    playerId: string;
    itemType: ItemType;
    discardedItem?: ItemType;
    position: { x: number; y: number };
}
