import { AppStorage } from '@/lib/storage';
import { ref, watch } from 'vue';
import { Howler } from 'howler';
import { BitField } from '@/lib/bit-field';

export enum ChatFilterFlag {
  UNCLASSIFIED = 1,
  PLAYER_CHAT = 2,
  USER_COMMAND = 4,
  TUTORIAL = 8,
  ITEM_SENT = 16,
  ITEM_HINTED = 32,
  GOALED = 64,
  CONNECTED = 128,
  DISCONNECTED = 256,
  TAG_CHANGE = 512,
  DEATH_LINK = 1024
}

const filterFlags = new BitField<ChatFilterFlag>();
filterFlags.add(ChatFilterFlag.TAG_CHANGE);

export const settings = ref({
  // Player settings
  showPlayerProgress: true,
  showPlayerCheckCount: false,
  showPlayerDecimal: false,

  // Hint settings
  hintsFilterFound: false,
  locationHintFilterFound: false,
  hintCopyButtonEnabled: true,
  hintCopyType: 'markdown' as 'markdown' | 'plain' | 'ascii' | 'item-name',

  // Notification settings
  notificationsItemSent: true,
  notificationsItemSentNormal: true,
  notificationsItemSentUseful: true,
  notificationsItemSentProgression: true,
  notificationsItemSentTrap: true,
  notificationsPlayerConnected: true,
  notificationsVolume: 0.5,
  notificationsUseDesktop: false,

  // Tracker settings
  trackerCollectedSimplified: false,

  // General settings
  generalAutoReconnect: true,
  generalShowPlayerTooltips: true,
  generalShowItemTooltips: true,
  lazyLoadTables: false,
  logTagChanges: false,
  showLoginThemeButton: true,

  // Chat settings
  chatFilterFlags: filterFlags.value
} satisfies Record<string, any>);

export function chatFilterHasFlag(flag: ChatFilterFlag) {
  return new BitField<ChatFilterFlag>(settings.value.chatFilterFlags).has(flag);
}

// Automatically store settings when they change
watch(settings, () => {
  AppStorage.setJSON('settings', settings.value);
  Howler.volume(settings.value.notificationsVolume);
}, { deep: true });

export function loadSettings() {
  const savedSettings = AppStorage.getJSON<any>('settings') || {};
  settings.value = { ...settings.value, ...savedSettings };
  Howler.volume(settings.value.notificationsVolume);
}