import '98.css';
import '@/assets/main.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { settings } from './state';

const localStorageKey = 'tawc:user-settings';

const savedSettings = localStorage.getItem(localStorageKey);
if (savedSettings) {
  let parsedSettings = {};
  try {
    parsedSettings = JSON.parse(savedSettings);
  } catch (error) {
    console.error('Error parsing saved settings:', error);
  }
  settings.value = { ...settings.value, ...parsedSettings };

  Howler.volume(settings.value.notificationsVolume);
}

const app = createApp(App)

app.use(router)

app.mount('#app')
