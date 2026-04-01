import { client } from '@/lib/archipelago';
import { clientStatuses } from 'archipelago.js';
import { ref } from 'vue';

export interface LocalPlayer {
  name: string;
  status: string;
  slot: number;
  game: string;
  team: number;
  progress?: number;
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
  const allPlayers = client.players.teams.flat();

  if (players.value.length === 0) {
    players.value = allPlayers.map((playerSlot, index) => ({
      name: playerSlot.name,
      status: '...',
      slot: playerSlot.slot,
      game: playerSlot.game,
      team: playerSlot.team
    }));
  }

  players.value.forEach(async player => {
    const me = allPlayers.find(p => p.slot === player.slot);
    if (!me) return;

    const status = await me.fetchStatus().catch(() => null);
    player.status = status !== null ? (clientStatusMap[status] || '') : '';
  });
}