import '98.css';
import '@/assets/styles/theme.css';
import '@/assets/styles/main.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { AppStorage } from './lib/storage';
import { settings } from './state/settings';

// Load local settings
const savedSettings = AppStorage.getJSON<any>('settings') || {};
settings.value = { ...settings.value, ...savedSettings };

// Apply saved volume
Howler.volume(settings.value.notificationsVolume);

const app = createApp(App);

app.use(router);

app.mount('#app');
