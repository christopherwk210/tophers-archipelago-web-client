import '98.css';
import '@/assets/styles/theme.css';
import 'tippy.js/dist/tippy.css';
import '@/assets/styles/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { loadSettings } from './state/settings';
import { loadTheme } from './state/theme';
import { delegate } from 'tippy.js';
import { createI18n } from 'vue-i18n';
import { i18n_messages } from './localization';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: i18n_messages
});

loadSettings();
loadTheme();

delegate(document.body, {
  target: '[data-tippy-content]',
  allowHTML: true
});

const app = createApp(App);
app.use(i18n);
app.use(router);
app.mount('#app');
