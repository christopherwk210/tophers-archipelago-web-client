<script setup lang="ts">
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

function resetToDefault() {
  const proceed = confirm('This will reset all theme settings to default. Do you want to continue?');
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
    alert('Failed to import theme. Please make sure you have the theme code copied to your clipboard.');
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
    <legend><strong>Theme</strong></legend>

    <div style="margin-bottom: 1em">
      <select style="display: block; width: 100%; max-width: 300px;" v-model="selectedTheme">
        <option v-for="theme of Object.keys(themes)" :value="theme">{{ theme }}</option>
      </select>
    </div>

    <label style="margin-bottom: 0.5em" for="fontSize">Font size (<strong>{{ themeCSSfontSize }}</strong>):</label>
    <div class="field-row" style="max-width: 300px; margin-bottom: 1em;">
      <label for="fontSize">Small</label>
      <input v-model.number.lazy="themeFontSize" id="fontSize" type="range" min="14" max="20" value="16" step="1" />
      <label for="fontSize">Large</label>
    </div>

    <div class="color-table">
      <div>
        <div style="margin-bottom: 0.5em"><strong>Item name colors</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSitemNormal" />
          <label>Class: Normal</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSitemUseful" />
          <label>Class: Useful</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSitemProgression" />
          <label>Class: Progression</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSitemTrap" />
          <label>Class: Trap</label>
        </div>
      </div>
  
      <div>
        <div style="margin-bottom: 0.5em;"><strong>Player name colors</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSplayerYou" />
          <label>You</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSplayerOther" />
          <label>Others</label>
        </div>
      </div>
  
      <div>
        <div style="margin-bottom: 0.5em;"><strong>Misc colors</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSlocation" />
          <label>Location names</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSStextHelp" />
          <label>Help text</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSStextJoin" />
          <label>Player joined</label>
        </div>
      </div>

      <div>
        <div style="margin-bottom: 0.5em;"><strong>Status colors</strong></div>
        <div class="field-row">
          <input type="color" v-model="themeCSSstatusFound" />
          <label>Found</label>
        </div>
    
        <div class="field-row">
          <input type="color" v-model="themeCSSstatusPriority" />
          <label>Priority</label>
        </div>

        <div class="field-row">
          <input type="color" v-model="themeCSSstatusNoPriority" />
          <label>No Priority</label>
        </div>

        <div class="field-row">
          <input type="color" v-model="themeCSSstatusAvoid" />
          <label>Avoid</label>
        </div>

        <div class="field-row">
          <input type="color" v-model="themeCSSstatusNone" />
          <label>None</label>
        </div>
      </div>
    </div>

    <div class="action-row">
      <button @click="exportThemeClicked">Export</button>
      <button @click="importThemeClicked">Import from clipboard</button>
      <button @click="resetToDefault">Reset to default</button>
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