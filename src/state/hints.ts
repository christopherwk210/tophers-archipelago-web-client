import { client, getItemClass, ItemClass } from '@/lib/archipelago';
import { reactive, ref } from 'vue';

export enum HintStatus {
  UNSPECIFIED = 0,
  NO_PRIORITY = 10,
  AVOID = 20,
  PRIORITY = 30,
  FOUND = 40
}

export interface LocalHint {
  item: string;
  itemClass: ItemClass[];
  found: boolean;
  player: string;
  slot: number;
  game: string;
  location: string;
  locationId: number;
  owner: string;
  ownerSlot: number;
  ownerGame: string;
  status: HintStatus;
}

export const hints = reactive({
  cost: 0,
  points: 0,
  list: [] as LocalHint[]
});

export function getCssVarFromStatus(status: HintStatus) {
  switch (status) {
    case HintStatus.PRIORITY:
      return 'var(--theme-status-priority)';
    case HintStatus.UNSPECIFIED:
      return 'var(--theme-status-none)';
    case HintStatus.FOUND:
      return 'var(--theme-status-found)';
    case HintStatus.AVOID:
      return 'var(--theme-status-avoid)';
    case HintStatus.NO_PRIORITY:
      return 'var(--theme-status-no-priority)';
  }
}

export function getHintStatusName(status: HintStatus) {
  switch (status) {
    case HintStatus.PRIORITY:
      return 'Priority';
    case HintStatus.UNSPECIFIED:
      return 'Unspecified';
    case HintStatus.FOUND:
      return 'Found';
    case HintStatus.AVOID:
      return 'Avoid';
    case HintStatus.NO_PRIORITY:
      return 'No Priority';
  }
}

export const hintsLastUpdated = ref(0);

export async function loadHints() {
  hints.cost = client.room.hintCost;
  hints.points = client.room.hintPoints;

  const list = await client.players.self.fetchHints().catch(() => []);
  
  hints.list = list.map(hint => {
    const validStatus = !!HintStatus[(hint as any).status];

    return {
      item: hint.item.name,
      itemClass: getItemClass(hint.item),
      found: hint.found,
      player: hint.item.receiver.alias,
      slot: hint.item.receiver.slot,
      game: hint.item.receiver.game,
      location: hint.item.locationName,
      locationId: hint.item.locationId,
      owner: hint.item.sender.alias,
      ownerSlot: hint.item.sender.slot,
      ownerGame: hint.item.sender.game,
      status: validStatus ? (hint as any).status : HintStatus.UNSPECIFIED
    };
  });

  hintsLastUpdated.value = Date.now();
}