import { client, getItemClass, ItemClass } from '@/lib/archipelago';
import { reactive } from 'vue';

export interface LocalHint {
  item: string;
  itemClass: ItemClass[];
  found: boolean;
  player: string;
  location: string;
  owner: string;
}

export const hints = reactive({
  cost: 0,
  points: 0,
  list: [] as LocalHint[]
});

export async function loadHints() {
  hints.cost = client.room.hintCost;
  hints.points = client.room.hintPoints;

  const list = await client.players.self.fetchHints().catch(() => []);
  hints.list = list.map(hint => {
    return {
      item: hint.item.name,
      itemClass: getItemClass(hint.item),
      found: hint.found,
      player: hint.item.receiver.alias,
      slot: hint.item.receiver.slot,
      game: hint.item.receiver.game,
      location: hint.item.locationName,
      owner: hint.item.sender.alias,
      ownerSlot: hint.item.sender.slot,
      ownerGame: hint.item.sender.game
    };
  });
}