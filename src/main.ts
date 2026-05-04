import '98.css';
import '@/assets/styles/theme.css';
import 'tippy.js/dist/tippy.css';
import '@/assets/styles/main.css';

import { app } from '@/app';
import router from './router';
import { loadSettings, settings } from './state/settings';
import { loadTheme } from './state/theme';
import { delegate } from 'tippy.js';
import { createI18n } from 'vue-i18n';
import { i18n_messages } from './localization';

loadSettings();
loadTheme();

const i18n = createI18n({
  legacy: false,
  locale: settings.value.generalSelectedLocale,
  fallbackLocale: 'en',
  messages: i18n_messages,
  warnHtmlMessage: false
});

delegate(document.body, {
  target: '[data-tippy-content]',
  allowHTML: true
});

app.use(i18n);
app.use(router);
app.mount('#app');
