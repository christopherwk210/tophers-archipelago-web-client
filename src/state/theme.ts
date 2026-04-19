import { AppStorage } from '@/lib/storage';
import { customCSS, getCustomCSS } from '@/lib/theme';
import { useCssVar } from '@vueuse/core';
import { ref, watch } from 'vue';

const themeDark = './themes/dark.css';
const themeSteam = './themes/steam.css';
const themeXP = './themes/XP.css';
const themeXPSilver = './themes/XP-silver.css';
const themeVisualStudio = './themes/visual-studio.css';
const themeArchipelago = './themes/archipelago.css';
const themeSakura = './themes/sakura.css';
const themeSpring = './themes/spring.css';
const themeSimpleTeal = './themes/simple-teal.css';

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
export const themeCSSstatusPriority = useCssVar('--theme-status-priority');
export const themeCSSstatusNone = useCssVar('--theme-status-none');
export const themeCSSstatusFound = useCssVar('--theme-status-found');
export const themeCSSstatusAvoid = useCssVar('--theme-status-avoid');
export const themeCSSstatusNoPriority = useCssVar('--theme-status-no-priority');

const defaultThemeColors = {
  themeCSSlocation: '#8b008b',
  themeCSSitemNormal: '#5d920c',
  themeCSSitemUseful: '#0000ff',
  themeCSSitemProgression: '#ef23ef',
  themeCSSitemTrap: '#ff0000',
  themeCSSplayerYou: '#000000',
  themeCSSplayerOther: '#000000',
  themeCSStextHelp: '#008080',
  themeCSStextJoin: '#006400',
  themeCSSstatusPriority: '#7f65cb',
  themeCSSstatusNone: '#000000',
  themeCSSstatusFound: '#008543',
  themeCSSstatusAvoid: '#e5786c',
  themeCSSstatusNoPriority: '#00adad'
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
      themeCSStextJoin: '#52cb52',
      themeCSSstatusPriority: '#9b82e6',
      themeCSSstatusFound: '#29b56f',
      themeCSSitemUseful: '#7e7eff',
      themeCSSitemProgression: '#ff85ff',
      themeCSSitemTrap: '#ff4545'
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
  'Sakura': {
    css: themeSakura,
    defaults: defaultThemeColors
  },
  'Spring': {
    css: themeSpring,
    defaults: defaultThemeColors
  },
  'Simple Teal': {
    css: themeSimpleTeal,
    defaults: defaultThemeColors
  },
  // 'XP Silver': {
  //   css: themeXPSilver,
  //   defaults: defaultThemeColors
  // },
  'Custom...': {
    css: '',
    defaults: defaultThemeColors
  }
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
    themeCSSstatusPriority: string;
    themeCSSstatusNone: string;
    themeCSSstatusFound: string;
    themeCSSstatusAvoid: string;
    themeCSSstatusNoPriority: string;
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
  selectedTheme,
  themeCSSstatusPriority,
  themeCSSstatusNone,
  themeCSSstatusFound,
  themeCSSstatusAvoid,
  themeCSSstatusNoPriority
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
    statusPriority: themeCSSstatusPriority.value,
    statusNone: themeCSSstatusNone.value,
    statusFound: themeCSSstatusFound.value,
    statusAvoid: themeCSSstatusAvoid.value,
    statusNoPriority: themeCSSstatusNoPriority.value,
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
  themeCSSstatusPriority.value = savedTheme.statusPriority || themeDefaults.themeCSSstatusPriority;
  themeCSSstatusNone.value = savedTheme.statusNone || themeDefaults.themeCSSstatusNone;
  themeCSSstatusFound.value = savedTheme.statusFound || themeDefaults.themeCSSstatusFound;
  themeCSSstatusAvoid.value = savedTheme.statusAvoid || themeDefaults.themeCSSstatusAvoid;
  themeCSSstatusNoPriority.value = savedTheme.statusNoPriority || themeDefaults.themeCSSstatusNoPriority;

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
  themeCSSstatusPriority.value = themeDefaults.themeCSSstatusPriority;
  themeCSSstatusNone.value = themeDefaults.themeCSSstatusNone;
  themeCSSstatusFound.value = themeDefaults.themeCSSstatusFound;
  themeCSSstatusAvoid.value = themeDefaults.themeCSSstatusAvoid;
  themeCSSstatusNoPriority.value = themeDefaults.themeCSSstatusNoPriority;
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
    theme: selectedTheme.value,
    statusPriority: themeCSSstatusPriority.value,
    statusNone: themeCSSstatusNone.value,
    statusFound: themeCSSstatusFound.value,
    statusAvoid: themeCSSstatusAvoid.value,
    statusNoPriority: themeCSSstatusNoPriority.value
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
  themeCSSstatusPriority.value = parsed.statusPriority || themeDefaults.themeCSSstatusPriority;
  themeCSSstatusNone.value = parsed.statusNone || themeDefaults.themeCSSstatusNone;
  themeCSSstatusFound.value = parsed.statusFound || themeDefaults.themeCSSstatusFound;
  themeCSSstatusAvoid.value = parsed.statusAvoid || themeDefaults.themeCSSstatusAvoid;
  themeCSSstatusNoPriority.value = parsed.statusNoPriority || themeDefaults.themeCSSstatusNoPriority;

  return true;
}

async function applyTheme() {
  const styleElementId = 'tawc-theme';

  let styleElement: HTMLLinkElement = document.getElementById(styleElementId) as HTMLLinkElement;
  if (!styleElement) {
    styleElement = document.createElement('link');
    styleElement.id = styleElementId;
    styleElement.rel = 'stylesheet';
    document.head.appendChild(styleElement);
  }

  styleElement.href = themes[selectedTheme.value].css;

  
  if (selectedTheme.value === 'Custom...') {
    customCSS.value = await getCustomCSS();

    let customStyleTag = document.querySelector('style[data-tawc-custom-theme]');
    if (!customStyleTag) {
      customStyleTag = document.createElement('style');
      customStyleTag.setAttribute('data-tawc-custom-theme', 'true');
      document.head.appendChild(customStyleTag);
    }

    customStyleTag.innerHTML = customCSS.value;
  } else {
    const customStyleTag = document.querySelector('style[data-tawc-custom-theme]');
    if (customStyleTag) {
      document.head.removeChild(customStyleTag);
    }
  }
}

watch(selectedTheme, () => {
  applyTheme();
});