import { AppStorage } from '@/lib/storage';
import { useCssVar } from '@vueuse/core';
import { ref, watch } from 'vue';

const themeDark = './themes/dark.css';
const themeSteam = './themes/steam.css';
const themeXP = './themes/XP.css';
const themeXPSilver = './themes/XP-silver.css';
const themeVisualStudio = './themes/visual-studio.css';
const themeArchipelago = './themes/archipelago.css';

export const themeCSSlocation = useCssVar('--theme-location');
export const themeCSSitemNormal = useCssVar('--theme-item-normal');
export const themeCSSitemUseful = useCssVar('--theme-item-useful');
export const themeCSSitemProgression = useCssVar('--theme-item-progression');
export const themeCSSitemTrap = useCssVar('--theme-item-trap');
export const themeCSSplayerYou = useCssVar('--theme-player-you');
export const themeCSSplayerOther = useCssVar('--theme-player-other');
export const themeCSStextHelp = useCssVar('--theme-text-help');
export const themeCSStextJoin = useCssVar('--theme-text-join');
export const themeCSSfontSize = useCssVar('--theme-font-size');

const defaultThemeColors = {
  themeCSSlocation: '#8b008b',
  themeCSSitemNormal: '#5d920c',
  themeCSSitemUseful: '#0000ff',
  themeCSSitemProgression: '#ef23ef',
  themeCSSitemTrap: '#ff0000',
  themeCSSplayerYou: '#000000',
  themeCSSplayerOther: '#000000',
  themeCSStextHelp: '#008080',
  themeCSStextJoin: '#006400'
} as const;

export const themes = {
  'Default': {
    css: '',
    defaults: defaultThemeColors
  },
  // 'Archipelago': {
  //   css: themeArchipelago,
  //   defaults: {
  //     themeCSSlocation: '#ff6eff',
  //     themeCSSitemNormal: '#c2ff66',
  //     themeCSSitemUseful: '#8989ff',
  //     themeCSSitemProgression: '#ff5dff',
  //     themeCSSitemTrap: '#ff5a5a',
  //     themeCSSplayerYou: '#ffffff',
  //     themeCSSplayerOther: '#ffffff',
  //     themeCSStextHelp: '#55e2e2',
  //     themeCSStextJoin: '#28d328'
  //   }
  // },
  'Dark': {
    css: themeDark,
    defaults: {
      ...defaultThemeColors,
      themeCSSplayerYou: '#ffffff',
      themeCSSplayerOther: '#ffffff',
      themeCSStextHelp: '#2dc2c2',
      themeCSStextJoin: '#2f9a2f'
    }
  },
  'Steam': {
    css: themeSteam,
    defaults: {
      ...defaultThemeColors,
      themeCSSlocation: '#ffc0ff',
      themeCSSplayerYou: '#ffffff',
      themeCSSplayerOther: '#ffffff',
      themeCSStextHelp: '#3dc7c7',
      themeCSStextJoin: '#52cb52'
    }
  },
  'XP': {
    css: themeXP,
    defaults: defaultThemeColors
  },
  'Visual Studio': {
    css: themeVisualStudio,
    defaults: {
      ...defaultThemeColors,
      themeCSSplayerYou: '#ffffff',
      themeCSSplayerOther: '#ffffff',
      themeCSStextHelp: '#2dc2c2',
      themeCSStextJoin: '#2f9a2f',
      themeCSSlocation: '#1da75b'
    }
  },
  // 'XP Silver': {
  //   css: themeXPSilver,
  //   defaults: defaultThemeColors
  // },
} as const satisfies Record<string, {
  css: string;
  defaults: {
    themeCSSlocation: string;
    themeCSSitemNormal: string;
    themeCSSitemUseful: string;
    themeCSSitemProgression: string;
    themeCSSitemTrap: string;
    themeCSSplayerYou: string;
    themeCSSplayerOther: string;
    themeCSStextHelp: string;
    themeCSStextJoin: string;
  };
}>;

export type Theme = keyof typeof themes;

export const selectedTheme = ref<Theme>('Default');

watch([
  themeCSSlocation,
  themeCSSitemNormal,
  themeCSSitemUseful,
  themeCSSitemProgression,
  themeCSSitemTrap,
  themeCSSplayerYou,
  themeCSSplayerOther,
  themeCSStextHelp,
  themeCSStextJoin,
  themeCSSfontSize,
  selectedTheme
], () => {
  AppStorage.setJSON('theme', {
    location: themeCSSlocation.value,
    itemNormal: themeCSSitemNormal.value,
    itemUseful: themeCSSitemUseful.value,
    itemProgression: themeCSSitemProgression.value,
    itemTrap: themeCSSitemTrap.value,
    playerYou: themeCSSplayerYou.value,
    playerOther: themeCSSplayerOther.value,
    textHelp: themeCSStextHelp.value,
    textJoin: themeCSStextJoin.value,
    fontSize: themeCSSfontSize.value,
    theme: selectedTheme.value
  });
});

const themeCSSfontSizeDefault = '16px';
const selectedThemeDefault: Theme = 'Default';

export function loadTheme() {
  const savedTheme = AppStorage.getJSON<any>('theme') || {};
  selectedTheme.value = savedTheme.theme || selectedThemeDefault;
  if (!Object.keys(themes).includes(selectedTheme.value)) {
    selectedTheme.value = selectedThemeDefault;
  }
  const themeDefaults = themes[selectedTheme.value].defaults;

  themeCSSlocation.value = savedTheme.location || themeDefaults.themeCSSlocation;
  themeCSSitemNormal.value = savedTheme.itemNormal || themeDefaults.themeCSSitemNormal;
  themeCSSitemUseful.value = savedTheme.itemUseful || themeDefaults.themeCSSitemUseful;
  themeCSSitemProgression.value = savedTheme.itemProgression || themeDefaults.themeCSSitemProgression;
  themeCSSitemTrap.value = savedTheme.itemTrap || themeDefaults.themeCSSitemTrap;
  themeCSSplayerYou.value = savedTheme.playerYou || themeDefaults.themeCSSplayerYou;
  themeCSSplayerOther.value = savedTheme.playerOther || themeDefaults.themeCSSplayerOther;
  themeCSStextHelp.value = savedTheme.textHelp || themeDefaults.themeCSStextHelp;
  themeCSStextJoin.value = savedTheme.textJoin || themeDefaults.themeCSStextJoin;
  themeCSSfontSize.value = savedTheme.fontSize || themeCSSfontSizeDefault;

  applyTheme();
}

export function resetThemeToDefault(theme: Theme) {
  const themeDefaults = themes[theme].defaults;

  themeCSSlocation.value = themeDefaults.themeCSSlocation;
  themeCSSitemNormal.value = themeDefaults.themeCSSitemNormal;
  themeCSSitemUseful.value = themeDefaults.themeCSSitemUseful;
  themeCSSitemProgression.value = themeDefaults.themeCSSitemProgression;
  themeCSSitemTrap.value = themeDefaults.themeCSSitemTrap;
  themeCSSplayerYou.value = themeDefaults.themeCSSplayerYou;
  themeCSSplayerOther.value = themeDefaults.themeCSSplayerOther;
  themeCSStextHelp.value = themeDefaults.themeCSStextHelp;
  themeCSStextJoin.value = themeDefaults.themeCSStextJoin;
  themeCSSfontSize.value = themeCSSfontSizeDefault;
}

/** Converts the theme to a compressed string */
export function exportTheme() {
  const theme = {
    location: themeCSSlocation.value,
    itemNormal: themeCSSitemNormal.value,
    itemUseful: themeCSSitemUseful.value,
    itemProgression: themeCSSitemProgression.value,
    itemTrap: themeCSSitemTrap.value,
    playerYou: themeCSSplayerYou.value,
    playerOther: themeCSSplayerOther.value,
    textHelp: themeCSStextHelp.value,
    textJoin: themeCSStextJoin.value,
    fontSize: themeCSSfontSize.value,
    theme: selectedTheme.value
  };

  const json = JSON.stringify(theme);
  const compressed = btoa(json);
  return compressed;
}

export function importTheme(theme: string) {
  let json = '';

  try {
    json = atob(theme);
  } catch (e) {
    console.error('Failed to decode theme:', e);
    return false;
  }
  
  let parsed: any = {};

  try {
    parsed = JSON.parse(json);
  } catch (e) {
    console.error('Failed to parse theme:', e);
    return false;
  }
  
  selectedTheme.value = parsed.theme || selectedThemeDefault;
  const themeDefaults = themes[selectedTheme.value].defaults;

  themeCSSlocation.value = parsed.location || themeDefaults.themeCSSlocation;
  themeCSSitemNormal.value = parsed.itemNormal || themeDefaults.themeCSSitemNormal;
  themeCSSitemUseful.value = parsed.itemUseful || themeDefaults.themeCSSitemUseful;
  themeCSSitemProgression.value = parsed.itemProgression || themeDefaults.themeCSSitemProgression;
  themeCSSitemTrap.value = parsed.itemTrap || themeDefaults.themeCSSitemTrap;
  themeCSSplayerYou.value = parsed.playerYou || themeDefaults.themeCSSplayerYou;
  themeCSSplayerOther.value = parsed.playerOther || themeDefaults.themeCSSplayerOther;
  themeCSStextHelp.value = parsed.textHelp || themeDefaults.themeCSStextHelp;
  themeCSStextJoin.value = parsed.textJoin || themeDefaults.themeCSStextJoin;
  themeCSSfontSize.value = parsed.fontSize || themeCSSfontSizeDefault;

  return true;
}

function applyTheme() {
  const styleElementId = 'tawc-theme';

  let styleElement: HTMLLinkElement = document.getElementById(styleElementId) as HTMLLinkElement;
  if (!styleElement) {
    styleElement = document.createElement('link');
    styleElement.id = styleElementId;
    styleElement.rel = 'stylesheet';
    document.head.appendChild(styleElement);
  }

  styleElement.href = themes[selectedTheme.value].css;
}

watch(selectedTheme, () => {
  applyTheme();
});