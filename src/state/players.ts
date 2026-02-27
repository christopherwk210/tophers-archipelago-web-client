import { client } from '@/lib/archipelago';
import { clientStatuses } from 'archipelago.js';
import { ref } from 'vue';

export interface LocalPlayer {
  name: string;
  status: string;
  game: string;
  team: number;
}

export const players = ref<LocalPlayer[]>([]);

// Map client statuses to easily apply labels to local players
const clientStatusMap: Record<number, string> = {};
for (const [key, value] of Object.entries(clientStatuses)) {
  let properName = '';
  switch (key) {
    case 'connected':
      properName = 'Connected';
      break;
    case 'disconnected':
      properName = 'Disconnected';
      break;
    case 'goal':
      properName = 'Completed';
      break;
    case 'playing':
      properName = 'Playing';
      break;
    case 'ready':
      properName = 'Ready';
      break;
  }
  clientStatusMap[value] = properName;
}

export async function loadPlayers() {
  const localPlayers: LocalPlayer[] = [];
  const allPlayers = client.players.teams.flat();

  const results = await Promise.all(
    allPlayers.map(async (player) => {
      const status = await player.fetchStatus().catch(() => null);

      return {
        name: player.alias,
        status: status !== null ? clientStatusMap[status] : '',
        game: player.game,
        slot: player.slot,
        team: player.team
      } as LocalPlayer;
    })
  );

  localPlayers.push(...results);
  players.value = localPlayers;
}