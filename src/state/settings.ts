import { ref } from 'vue';

export const settings = ref({
  // Hint settings
  hintsFilterFound: false,

  // Notification settings
  notificationsItemSent: true,
  notificationsPlayerConnected: true,
  notificationsVolume: 0.5,

  // General settings
  generalAutoReconnect: true
} satisfies Record<string, any>);