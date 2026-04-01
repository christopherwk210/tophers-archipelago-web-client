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

loadSettings();
loadTheme();

delegate(document.body, {
  target: '[data-tippy-content]',
  allowHTML: true
});

const app = createApp(App);
app.use(router);
app.mount('#app');
