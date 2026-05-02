<script setup lang="ts">
import { useCssVar, useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';
import ThemeSettings from './Settings/ThemeSettings.vue';

const themeCss = {
  location: useCssVar('--theme-location'),
  itemNormal: useCssVar('--theme-item-normal'),
  itemUseful: useCssVar('--theme-item-useful'),
  itemProgression: useCssVar('--theme-item-progression'),
  itemTrap: useCssVar('--theme-item-trap'),
  playerYou: useCssVar('--theme-player-you'),
  playerOther: useCssVar('--theme-player-other'),
  textHelp: useCssVar('--theme-text-help'),
  textJoin: useCssVar('--theme-text-join'),
  fontSize: useCssVar('--theme-font-size')
};

const themeFontSize = ref(parseFloat(themeCss.fontSize.value!));

const updateFontSize = useDebounceFn(() => {
  themeCss.fontSize.value = `${themeFontSize.value}px`;
}, 500)

watch(themeFontSize, () => updateFontSize());
</script>

<template>
  <div class="inner-container">
    <ThemeSettings />
  </div>
</template>

<style scoped>
button, :deep(button) {
  padding-top: 0.3em;
  padding-bottom: 0.3em;
}

.audio-play-btn {
  width: 2em;
  height: 2em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0.25em;
  min-height: initial !important;
  min-width: initial !important;
  margin-right: 0.5em;
}

.audio-play-btn img {
  align-self: center;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.radio-row {
  margin-bottom: 0.5em;
  padding-left: 0.5em;
}

.warning {
  background: rgba(0, 0, 0, 0.075);
  padding: 0.5em;
  margin-bottom: 1em;
  display: flex;
}
</style>