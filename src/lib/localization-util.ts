import { app } from '@/app';
import type { i18n_messages } from '@/localization';
import { parseChangelog } from '@/state/changelog';
import { translateCommandHints } from '@/state/chat';
import { getCurrentInstance } from 'vue';

type Base = typeof i18n_messages['en'];
export type LocaleKey = { [C in keyof Base]: `${C}.${keyof Base[C] & string}` }[keyof Base];

export function useLocalization() {
  // const instance = getCurrentInstance();

  function t(key: LocaleKey, ...args: unknown[]) {
    // return (instance?.appContext.config.globalProperties.$t as any)(key, ...args) ?? '';
    return (app.config.globalProperties.$t as any)(key, ...args) ?? '';
  }

  return { t };
}

export function translateInternals() {
  translateCommandHints();
  parseChangelog();
}