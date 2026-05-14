<script setup lang="ts">
import { useLocalization } from '@/lib/localization-util';
import { cursorAssets } from '@/server/cursor-assets';
import { settings } from '@/state/settings';
import Cursor from '@/server/Cursor.vue';

const { t } = useLocalization();
</script>

<template>
  <fieldset class="mt-3">
    <legend><strong>{{ t('Settings.settingsServer') }}</strong></legend>
    
    <div style="margin-top: 0.5em" class="check-row">
      <input v-model="settings.serverCursorsEnable" type="checkbox" id="serverCursorsEnable">
      <label :data-tippy-content="t('Settings.settingsServerCursorsEnableTooltip')" for="serverCursorsEnable">{{ t('Settings.settingsServerCursorsEnable') }}</label>
    </div>

    <label style="margin-top: 0.5em; margin-bottom: 0.5em; font-size: 0.95em" for="cursorVisibility">
      {{ t('Settings.settingsServerCursorsVisibility') }}
      <component :style="{ opacity: settings.serverCursorsOpacity }" class="visibility-display" :is="cursorAssets.hand_point.image" />
    </label>
    <div class="field-row" style="max-width: 300px; margin-bottom: 1em;">
      <label for="cursorVisibility">{{ t('Settings.settingsServerCursorsInvisible') }}</label>
      <input v-model.number="settings.serverCursorsOpacity" id="cursorVisibility" type="range" min="0.1" max="1" value="0.5" step="0.1" />
      <label for="cursorVisibility">{{ t('Settings.settingsServerCursorsVisible') }}</label>
    </div>

    <label>{{ t('Settings.settingsServerCursorsCustomize') }}</label>
    <div class="sunken-panel cursor-selector">
      <div
        v-for="([name, asset]) of Object.entries(cursorAssets)"
        @click="() => settings.serverCursorsImage = (name as any)"
        class="cursor-selector-cursor"
        :class="{ selected: settings.serverCursorsImage === name }"
      >
        <Cursor class="cursor-image" :image="asset.asset_raw" :color="settings.serverCursorsColor" />
      </div>
    </div>
    <div style="margin-top: 0.5em;" class="field-row">
      <input type="color" v-model="settings.serverCursorsColor" />
      <label>{{ t('Settings.settingsServerCursorsColor') }}</label>
    </div>

    <div style="margin-top: 1em" class="check-row">
      <input v-model="settings.serverCursorsShowLocal" type="checkbox" id="serverCursorsShowLocal">
      <label for="serverCursorsShowLocal">{{ t('Settings.settingsServerCursorsShowLocal') }}</label>
    </div>

    <label class="disclaimer" v-html="t('Settings.settingsServerDisclaimer')"></label>
  </fieldset>
</template>

<style scoped>
.cursor-image {
  position: relative !important;
  opacity: 1 !important;
}

.disclaimer {
  font-size: 0.9em !important;
  opacity: 0.9;
  margin-top: 2em;
  display: block !important;
}

.visibility-display {
  margin-left: 0.5em;
  mix-blend-mode: difference;
}

.cursor-selector {
  padding: 0.5em;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}

.cursor-selector-cursor {
  display: flex;
  border: 1px solid transparent;
  padding: 4px;
  border-radius: 2px;
}

.cursor-selector-cursor:hover {
  background: rgba(0, 0, 0, 0.1);
  border: 1px dotted rgba(0, 0, 0, 0.5);
  outline: 1px dotted rgba(255, 255, 255, 0.5);
}

.cursor-selector-cursor.selected {
  border: 1px solid black;
  outline: 1px solid white;
}

input[type="color"] {
  height: 2.5em !important;
  width: 3em !important;
}
</style>