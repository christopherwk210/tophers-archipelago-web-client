import { client } from '@/lib/archipelago';
import type { LocaleKey } from '@/lib/localization-util';
import { clientStatuses } from 'archipelago.js';
import { ref } from 'vue';

export interface LocalPlayer {
  name: string;
  status: string;
  slot: number;
  game: string;
  team: number;
  clientStatus: number;
  progress?: number;
  progressTwoDecimal?: string;
  progressCollected?: number;
  progressTotal?: number;
}

export const players = ref<LocalPlayer[]>([]);

// Map client statuses to easily apply labels to local players
const clientStatusMap: Record<number, string> = {};
export const clientStatusMapTranslation: Record<number, LocaleKey> = {};
for (const [key, value] of Object.entries(clientStatuses)) {
  let properName = '';
  let translationKey: LocaleKey | null = null;

  switch (key) {
    case 'connected':
      properName = 'Connected';
      translationKey = 'Texts.textConnected';
      break;
    case 'disconnected':
      properName = 'Disconnected';
      translationKey = 'Texts.textDisconnected';
      break;
    case 'goal':
      properName = 'Completed';
      translationKey = 'Texts.textGoal';
      break;
    case 'playing':
      properName = 'Playing';
      translationKey = 'Texts.textPlaying';
      break;
    case 'ready':
      properName = 'Ready';
      translationKey = 'Texts.textReady';
      break;
  }

  clientStatusMap[value] = properName;
  if (translationKey !== null) clientStatusMapTranslation[value] = translationKey;
}

export async function loadPlayers() {
  const allPlayers = client.players.teams.flat();

  if (players.value.length === 0) {
    players.value = allPlayers.map((playerSlot, index) => ({
      name: playerSlot.name,
      status: '',
      slot: playerSlot.slot,
      game: playerSlot.game,
      team: playerSlot.team,
      clientStatus: -1
    }));
  }

  players.value.forEach(async player => {
    const me = allPlayers.find(p => p.slot === player.slot);
    if (!me) return;

    const status = await me.fetchStatus().catch(() => null);
    if (status !== null) {
      player.status = clientStatusMap[status] || '';
      player.clientStatus = status;
    }
  });
}