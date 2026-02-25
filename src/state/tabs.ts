import { TabManager, type Tab } from '@/lib/tab-manager';
import type { Component } from 'vue';

import Chat from '@/components/app-tabs/Chat.vue';
import Hints from '@/components/app-tabs/Hints.vue';
import Players from '@/components/app-tabs/Players.vue';
import Tracker from '@/components/app-tabs/Tracker.vue';
import More from '@/components/app-tabs/More.vue';

export interface ComponentTab extends Tab {
  component: Component;
}

export const appTabManager = new TabManager([
  {
    label: 'Chat',
    component: Chat
  },
  {
    label: 'Hints',
    component: Hints
  },
  {
    label: 'Players',
    component: Players
  },
  {
    label: 'Tracker',
    component: Tracker
  },
  {
    label: 'More',
    component: More
  }
] as const satisfies ComponentTab[]);

export enum AppTab {
  CHAT = 0,
  HINTS = 1,
  PLAYERS = 2,
  TRACKER = 3,
  MORE = 4
}