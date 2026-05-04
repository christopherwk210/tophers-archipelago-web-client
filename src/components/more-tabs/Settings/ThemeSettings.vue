<script setup lang="ts">
import { useLocalization } from '@/lib/localization-util';
import { settings } from '@/state/settings';
import {
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
  themeCSSstatusAvoid,
  themeCSSstatusNoPriority,
  themeCSSstatusFound,
  themeCSSstatusNone,
  themeCSSstatusPriority,
  resetThemeToDefault,
  exportTheme,
  importTheme,
  selectedTheme,
  themes
} from '@/state/theme';
import { ui } from '@/state/ui';

import { useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';

const { t } = useLocalization();

function resetToDefault() {
  const proceed = confirm(t('Theme.themeResetDefault'));
  if (!proceed) return;

  resetThemeToDefault(selectedTheme.value);
}

function exportThemeClicked() {
  ui.modals.exportTheme = exportTheme();
}

async function importThemeClicked() {
  const clipboardText = await navigator.clipboard.readText();
  const result = importTheme(clipboardText);

  if (!result) {
    alert(t('Theme.themeFailedImport'));
  }
}

watch(selectedTheme, () => {
  resetThemeToDefault(selectedTheme.value);
});

// Font size handling
const themeFontSize = ref(parseFloat(themeCSSfontSize.value!));
const updateFontSize = useDebounceFn(() => themeCSSfontSize.value = `${themeFontSize.value}px`, 100);
watch(themeFontSize, () => updateFontSize());
</script>

<template>
  <fieldset class="mt-3">
    <legend><strong>{{ t('More.moreTabTheme') }}</strong></legend>

    <div style="margin-bottom: 1em">
      <select v-if="!ui.design.windowOpen" style="display: block; width: 100%; max-width: 300px;" v-model="selectedTheme">
        <option v-for="theme of Object.keys(themes)" :value="theme">{{ theme }}</option>
      </select>
      <div style="display: inline-block; width: 100%; max-width: 300px;" v-else data-tippy-content="You can't change themes while the design window is open">
        <select disabled style="display: block; width: 100%; max-width: 300px; pointer-events: none;" v-model="selectedTheme">
          <option v-for="theme of Object.keys(themes)" :value="theme">{{ theme }}</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom: 1em" v-if="selectedTheme === 'Custom...'">
      <button :data-tippy-content="t('Theme.themeDesignWarning')" @click.prevent="ui.design.windowOpen = true">{{ t('Theme.themeDesignOpen') }}</button>
    </div>

    <div style="margin: 1em 0" class="check-row">
      <input v-model="settings.showLoginThemeButton" type="checkbox" id="showLoginThemeButton">
      <label for="showLoginThemeButton">{{ t('Settings.settingsShowThemeBtn') }}</label>
    </div>

    <label style="margin-bottom: 0.5em" for="fontSize">{{ t('Theme.themeFontSize') }} (<strong>{{ themeCSSfontSize }}</strong>):</label>
    <div class="field-row" style="max-width: 300px; margin-bottom: 1em;">
      <label for="fontSize">{{ t('Theme.themeSmall') }}</label>
      <input v-model.number.lazy="themeFontSize" id="fontSize" type="range" min="14" max="20" value="16" step="1" />
      <label for="fontSize">{{ t('Theme.themeLarge') }}</label>
    </div>

    <div class="color-table">
      <div>
        <div style="margin-bottom: 0.5em"><strong>{{ t('Theme.themeItemNameColors') }}</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSitemNormal" />
          <label>{{ t('Theme.themeClassNormal') }}</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSitemUseful" />
          <label>{{ t('Theme.themeClassUseful') }}</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSitemProgression" />
          <label>{{ t('Theme.themeClassProgression') }}</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSitemTrap" />
          <label>{{ t('Theme.themeClassTrap') }}</label>
        </div>
      </div>
  
      <div>
        <div style="margin-bottom: 0.5em;"><strong>{{ t('Theme.themePlayerNameColors') }}</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSplayerYou" />
          <label>{{ t('Theme.themeYou') }}</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSplayerOther" />
          <label>{{ t('Theme.themeOthers') }}</label>
        </div>
      </div>
  
      <div>
        <div style="margin-bottom: 0.5em;"><strong>{{ t('Theme.themeMiscColors') }}</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSlocation" />
          <label>{{ t('Theme.themeLocationNames') }}</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSStextHelp" />
          <label>{{ t('Theme.themeHelpText') }}</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSStextJoin" />
          <label>{{ t('Theme.themePlayerJoined') }}</label>
        </div>
      </div>

      <div>
        <div style="margin-bottom: 0.5em;"><strong>{{ t('Theme.themeStatusColors') }}</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSstatusFound" />
          <label>{{ t('Texts.textFound') }}</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSstatusPriority" />
          <label>{{ t('Texts.textPriority') }}</label>
        </div>

        <div class="field-row">
          <input type="color" v-model="themeCSSstatusNoPriority" />
          <label>{{ t('Texts.textNoPriority') }}</label>
        </div>

        <div class="field-row">
          <input type="color" v-model="themeCSSstatusAvoid" />
          <label>{{ t('Texts.textAvoid') }}</label>
        </div>

        <div class="field-row">
          <input type="color" v-model="themeCSSstatusNone" />
          <label>{{ t('Texts.textNone') }}</label>
        </div>
      </div>
    </div>

    <div class="action-row">
      <button @click="exportThemeClicked">{{ t('Theme.themeExport') }}</button>
      <button @click="importThemeClicked">{{ t('Theme.themeImportFromClipboard') }}</button>
      <button @click="resetToDefault">{{ t('Theme.themeResetToDefault') }}</button>
    </div>
  </fieldset>
</template>

<style scoped>
input[type="color"] {
  height: 2.5em !important;
  width: 3em !important;
}

.color-table {
  display: flex;
  gap: 2em;
  flex-wrap: wrap;
  margin-bottom: 1em;
}

.action-row {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}
</style>