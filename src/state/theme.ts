import { AppStorage } from '@/lib/storage';
import { useCssVar } from '@vueuse/core';
import { watch } from 'vue';

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
  themeCSSfontSize
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
    fontSize: themeCSSfontSize.value
  });
});

export function loadTheme() {
  const savedTheme = AppStorage.getJSON<any>('theme') || {};
  themeCSSlocation.value = savedTheme.location || themeCSSlocationDefault;
  themeCSSitemNormal.value = savedTheme.itemNormal || themeCSSitemNormalDefault;
  themeCSSitemUseful.value = savedTheme.itemUseful || themeCSSitemUsefulDefault;
  themeCSSitemProgression.value = savedTheme.itemProgression || themeCSSitemProgressionDefault;
  themeCSSitemTrap.value = savedTheme.itemTrap || themeCSSitemTrapDefault;
  themeCSSplayerYou.value = savedTheme.playerYou || themeCSSplayerYouDefault;
  themeCSSplayerOther.value = savedTheme.playerOther || themeCSSplayerOtherDefault;
  themeCSStextHelp.value = savedTheme.textHelp || themeCSStextHelpDefault;
  themeCSStextJoin.value = savedTheme.textJoin || themeCSStextJoinDefault;
  themeCSSfontSize.value = savedTheme.fontSize || themeCSSfontSizeDefault;
}

const themeCSSlocationDefault = '#8b008b';
const themeCSSitemNormalDefault = '#5d920c';
const themeCSSitemUsefulDefault = '#0000ff';
const themeCSSitemProgressionDefault = '#ef23ef';
const themeCSSitemTrapDefault = '#ff0000';
const themeCSSplayerYouDefault = '#000000';
const themeCSSplayerOtherDefault = '#000000';
const themeCSStextHelpDefault = '#008080';
const themeCSStextJoinDefault = '#006400';
const themeCSSfontSizeDefault = '16px';

export function resetThemeToDefault() {
  themeCSSlocation.value = themeCSSlocationDefault;
  themeCSSitemNormal.value = themeCSSitemNormalDefault;
  themeCSSitemUseful.value = themeCSSitemUsefulDefault;
  themeCSSitemProgression.value = themeCSSitemProgressionDefault;
  themeCSSitemTrap.value = themeCSSitemTrapDefault;
  themeCSSplayerYou.value = themeCSSplayerYouDefault;
  themeCSSplayerOther.value = themeCSSplayerOtherDefault;
  themeCSStextHelp.value = themeCSStextHelpDefault;
  themeCSStextJoin.value = themeCSStextJoinDefault;
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
    fontSize: themeCSSfontSize.value
  };

  const json = JSON.stringify(theme);
  const compressed = btoa(json);
  return compressed;
}

export function importTheme(theme: string) {
  const json = atob(theme);
  let parsed: any = {};

  try {
    parsed = JSON.parse(json);
  } catch (e) {
    console.error('Failed to parse theme:', e);
    return false;
  }
  
  themeCSSlocation.value = parsed.location || themeCSSlocationDefault;
  themeCSSitemNormal.value = parsed.itemNormal || themeCSSitemNormalDefault;
  themeCSSitemUseful.value = parsed.itemUseful || themeCSSitemUsefulDefault;
  themeCSSitemProgression.value = parsed.itemProgression || themeCSSitemProgressionDefault;
  themeCSSitemTrap.value = parsed.itemTrap || themeCSSitemTrapDefault;
  themeCSSplayerYou.value = parsed.playerYou || themeCSSplayerYouDefault;
  themeCSSplayerOther.value = parsed.playerOther || themeCSSplayerOtherDefault;
  themeCSStextHelp.value = parsed.textHelp || themeCSStextHelpDefault;
  themeCSStextJoin.value = parsed.textJoin || themeCSStextJoinDefault;
  themeCSSfontSize.value = parsed.fontSize || themeCSSfontSizeDefault;

  return true;
}