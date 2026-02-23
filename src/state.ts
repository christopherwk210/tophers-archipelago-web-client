import type { Hint, Item } from 'archipelago.js';
import { computed, ref } from 'vue';

export interface LocalPlayer {
  name: string;
  status: string;
  game: string;
  team: number;
}

export const appTabs = ref({
  tabs: [
    'Chat',
    'Hints',
    'Players',
    'Tracker',
    'Help'
  ],
  selectedTabIndex: 0
});

export const selectedTab = computed<string>(() => appTabs.value.tabs[appTabs.value.selectedTabIndex]!);


export const state = ref({
  mySlot: '',
  hints: [] as {
    found: boolean;
    item: string;
    player: string;
    location: string;
  }[],
  hintPoints: 0,
  hintCost: 0,
  players: [] as LocalPlayer[],
  items: {
    collected: [] as {
      name: string;
      location: string;
      locationGame: string;
      sender: string;
    }[]
  },
  locations: [] as {
    name: string;
    checked: boolean;
  }[],

  buyingItemHint: false
});