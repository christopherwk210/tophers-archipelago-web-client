<script setup lang="ts">
import { ui } from '@/state/ui';

function copyThemeToClipboard() {
  if (ui.modals.exportTheme === false) return;
  navigator.clipboard.writeText(ui.modals.exportTheme);
}
</script>

<template>
  <div class="export-theme-modal" v-if="ui.modals.exportTheme !== false">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">Export theme</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="ui.modals.exportTheme = false"></button>
        </div>
      </div>
      <div class="window-body">
        <p>Copy the text below to export your theme:</p>
        <textarea readonly>{{ ui.modals.exportTheme }}</textarea>
        <div style="display: flex; justify-content: center; gap: 1em">
          <button @click="copyThemeToClipboard">Copy</button>
          <button @click="ui.modals.exportTheme = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.export-theme-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;

  display: flex;
  justify-content: center;
  align-items: center;

  backdrop-filter: grayscale(1);
}

.window {
  width: 100%;
  max-width: 400px;
}

textarea {
  width: 100%;
  height: 200px;
  resize: none;
  font-size: 0.875em;
}
</style>