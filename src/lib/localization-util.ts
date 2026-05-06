import { app } from '@/app';
import { i18n_messages } from '@/localization';
import { parseChangelog, parseCreditsAndContributors } from '@/state/markdown';
import { translateCommandHints } from '@/state/chat';
import { initializeTippy } from '@/state/tippy';

type Base = typeof i18n_messages['en'];
export type LocaleKey = { [C in keyof Base]: `${C}.${keyof Base[C] & string}` }[keyof Base];

export function useLocalization() {
  // const instance = getCurrentInstance();

  function t(key: LocaleKey, ...args: unknown[]) {
    const translation: string = (app.config.globalProperties.$t as any)(key, ...args) ?? '';
    if (translation.trim().length === 0) {
      const splitKey = key.split('.');
      if (splitKey.length === 2) {
        return ((i18n_messages as any)?.['en']?.[splitKey[0]!]?.[splitKey[1]!]) ?? '';
      }
    }

    return translation;
  }

  return { t };
}

export function translateInternals() {
  translateCommandHints();
  parseChangelog();
  parseCreditsAndContributors();
  initializeTippy();
}

export function getPreferredLocale(): keyof typeof i18n_messages {
  const supported = Object.keys(i18n_messages['en']) as (keyof typeof i18n_messages)[];
  const langs = navigator.languages ?? [navigator.language];

  for (const lang of langs) {
    // exact match first
    if (supported.includes(lang as any)) return lang as any;

    // fallback to base language (e.g. "fr-CA" → "fr")
    const base: any = lang.split('-')[0];
    if (base && supported.includes(base)) return base;
  }

  return 'en'; // default fallback
}