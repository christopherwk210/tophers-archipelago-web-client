import { AppStorage } from '@/lib/storage';
import { ref, watch } from 'vue';
import { Howler } from 'howler';
import { BitField } from '@/lib/bit-field';
import { getPreferredLocale, translateInternals } from '@/lib/localization-util';
import type { i18n_messages } from '@/localization';
import { cursorAssets, type CursorImage } from '@/server/cursor-assets';
import { useCssVar } from '@vueuse/core';

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
  hintCopyLanguage: 'en' as 'default' | (keyof typeof i18n_messages),

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
  lazyLoadTables: false,
  logTagChanges: false, // @deprecated
  showLoginThemeButton: true,
  generalSelectedLocale: getPreferredLocale(),
  
  // UI settings
  generalShowPlayerTooltips: true,
  generalShowItemTooltips: true,
  uiShowUrlTitle: true,
  
  // Chat settings
  chatFilterFlags: filterFlags.value,

  // Server settings
  serverCursorsEnable: true,
  serverCursorsShowLocal: false,
  serverCursorsOpacity: 0.6,
  serverCursorsImage: 'dot_large' as CursorImage,
  serverCursorsColor: '#ffffff'
} satisfies Record<string, any>);

export function chatFilterHasFlag(flag: ChatFilterFlag) {
  return new BitField<ChatFilterFlag>(settings.value.chatFilterFlags).has(flag);
}

// const cursorPrimaryFill = useCssVar('--tawc-cursor-my-primary-fill');
// const cursorSecondaryFill = useCssVar('--tawc-cursor-my-secondary-fill');
const cursorOffsetX = useCssVar('--tawc-cursor-my-offset-x');
const cursorOffsetY = useCssVar('--tawc-cursor-my-offset-y');
const cursorUrl = useCssVar('--tawc-cursor-my-url');
const globalCursorOpacity = useCssVar('--tawc-cursor-opacity');

function updateCursor() {
  globalCursorOpacity.value = settings.value.serverCursorsOpacity.toString();

  if (settings.value.serverCursorsShowLocal) {
    document.body.classList.add('use-local-cursors');
  } else {
    document.body.classList.remove('use-local-cursors');
  }

  const cursorAsset = cursorAssets[settings.value.serverCursorsImage];

  const hex = settings.value.serverCursorsColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const secondaryColor = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;

  // cursorPrimaryFill.value = settings.value.serverCursorsColor;
  // cursorSecondaryFill.value = secondaryColor;
  cursorOffsetX.value = Math.abs(cursorAsset.offset.x).toString();
  cursorOffsetY.value = Math.abs(cursorAsset.offset.y).toString();

  const updatedCursorSVG = cursorAsset.asset_raw
    .replace(/var\(--tawc-cursor-primary-fill\)/g, settings.value.serverCursorsColor)
    .replace(/var\(--tawc-cursor-secondary-fill\)/g, secondaryColor);

  cursorUrl.value = `url("data:image/svg+xml;base64,${btoa(updatedCursorSVG)}")`;
}

// Automatically store settings when they change
watch(settings, () => {
  updateCursor();
  AppStorage.setJSON('settings', settings.value);
  Howler.volume(settings.value.notificationsVolume);
  translateInternals();
}, { deep: true });

export function loadSettings() {
  const savedSettings = AppStorage.getJSON<any>('settings') || {};
  settings.value = { ...settings.value, ...savedSettings };
  Howler.volume(settings.value.notificationsVolume);
}