import { ref } from 'vue';

export const settings = ref({
  /** Notification settings */
  notificationsItemSent: true,
  notificationsPlayerConnected: true,
  notificationsVolume: 0.5,

  /** General settings */
  generalAutoReconnect: true
} satisfies Record<string, any>);