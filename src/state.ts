import type { Hint } from 'archipelago.js';
import { ref } from 'vue';

export interface LocalPlayer {
  name: string;
  status: string;
  game: string;
  team: number;
}

export const state = ref({
  mySlot: '',
  hints: [] as {
    found: boolean;
    item: string;
    player: string;
    location: string;
  }[],
  players: [] as LocalPlayer[]
});