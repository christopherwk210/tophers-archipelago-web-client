<script setup lang="ts">
import { selectedTheme, themes } from '@/state/theme';
import { useElementBounding, useEventListener } from '@vueuse/core';
import { computed, ref, useTemplateRef } from 'vue';

const themeButton = useTemplateRef('theme-button');
const themeButtonBounding = useElementBounding(themeButton);

const themeSelectorVisible = ref(false);
const themeSelectorStyle = computed(() => {
  return {
    display: themeSelectorVisible.value ? 'block' : 'none',
    top: `${themeButtonBounding.bottom.value}px`,
    right: `${window.innerWidth - themeButtonBounding.right.value}px`
  };
});

useEventListener('click', () => {
  themeSelectorVisible.value = false;
});

function selectTheme(theme: any) {
  selectedTheme.value = theme;
}
</script>

<template>
  <div class="theme-button-container">
    <button @click.prevent.stop="themeSelectorVisible = !themeSelectorVisible" ref="theme-button" data-tippy-content="Change theme" class="theme-button"></button>
  </div>

  <div :style="themeSelectorStyle" class="theme-selector-container window">
    <div class="theme-selector-title"><em>Select theme:</em></div>
    <div @click="selectTheme(theme)" class="theme-selector-item" v-for="theme of Object.keys(themes)">{{ theme }}</div>
  </div>
</template>

<style scoped>
.theme-button-container {
  position: absolute;
  top: 1em;
  right: 1em;
}

.theme-button {
  background-image: url('@/assets/icons/paint.png');
  background-repeat: no-repeat;
  background-position: center;
  width: 64px;
  height: 64px;
  min-width: 0;
  min-height: 0;
}

.theme-button:active {
  background-position: calc(50% + 2px) calc(50% + 2px);
}

.theme-selector-container {
  position: absolute;
  z-index: 99999;
}

.theme-selector-item, .theme-selector-title {
  padding: 4px 12px;
  user-select: none;
}

.theme-selector-title {
  opacity: 0.5;
}

.theme-selector-item:hover {
  background: navy;
  color: white;
}
</style>