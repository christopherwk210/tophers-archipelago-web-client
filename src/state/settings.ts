import { AppStorage } from '@/lib/storage';
import { ref, watch } from 'vue';
import { Howler } from 'howler';

export const settings = ref({
  // Hint settings
  hintsFilterFound: false,
  locationHintFilterFound: false,

  // Notification settings
  notificationsItemSent: true,
  notificationsItemSentNormal: true,
  notificationsItemSentUseful: true,
  notificationsItemSentProgression: true,
  notificationsItemSentTrap: true,
  notificationsPlayerConnected: true,
  notificationsVolume: 0.5,

  // General settings
  generalAutoReconnect: true,
  generalShowPlayerTooltips: true,
  generalShowItemTooltips: true
} satisfies Record<string, any>);

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