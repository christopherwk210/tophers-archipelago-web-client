import { ref } from 'vue';

export const notificationsSupported = ref(false);

function detectSupport() {
  if (!window || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;

  // https://stackoverflow.com/questions/29774836/failed-to-construct-notification-illegal-constructor/29895431
  // https://issues.chromium.org/issues/40415865
  try {
    const notification = new Notification('');
    notification.onshow = () =>  notification.close();
  }
  catch (e) {
    // Android Chrome: Uncaught TypeError: Failed to construct 'Notification': Illegal constructor. Use ServiceWorkerRegistration.showNotification() instead.
    // @ts-expect-error catch TypeError
    if (e.name === 'TypeError') return false;
  }
  
  return true;
}

notificationsSupported.value = detectSupport();

export function desktopNotify(title: string, options?: NotificationOptions) {
  if (!notificationsSupported.value || Notification.permission !== 'granted') return null;
  return new Notification(title, {
    silent: true,
    icon: '/favicon-96x96.png',
    badge: '/favicon-96x96.png',
    ...options
  });
}