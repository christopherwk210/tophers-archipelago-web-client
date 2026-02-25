import { client } from '@/lib/archipelago';
import { reactive } from 'vue';

export interface LocalHint {
  item: string;
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
      found: hint.found,
      player: hint.item.receiver.alias,
      location: hint.item.locationName,
      owner: hint.item.sender.alias
    };
  });
}