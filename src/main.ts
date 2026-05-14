import '98.css';
import '@/assets/styles/theme.css';
import 'tippy.js/dist/tippy.css';
import '@/assets/styles/main.css';

import { app } from '@/app';
import router from './router';
import { loadSettings, settings } from './state/settings';
import { loadTheme } from './state/theme';
import { createI18n } from 'vue-i18n';
import { i18n_messages } from './localization';
import { initializeTippy } from './state/tippy';

loadSettings();
loadTheme();

const i18n = createI18n({
  legacy: false,
  locale: settings.value.generalSelectedLocale,
  fallbackLocale: 'en',
  messages: i18n_messages,
  warnHtmlMessage: false
});

initializeTippy();

// https://stackoverflow.com/questions/69348371/vue-3-replacing-the-html-tags-where-v-html-is-called-with-the-provided-html/69354385#69354385
app.directive('html-fragment', el => {
  if (!el) return;

  // copy attributes to first child
  const content = el.tagName === 'TEMPLATE' ? el.content : el
  if (content.children.length === 1) {
    ;[...el.attributes].forEach((attr) => content.firstChild.setAttribute(attr.name, attr.value))
  }

  // replace element with content
  if (el.tagName === 'TEMPLATE') {
    el.replaceWith(el.content)
  } else {
    el.replaceWith(...el.children)
  }
});

app.use(i18n);
app.use(router);
app.mount('#app');
