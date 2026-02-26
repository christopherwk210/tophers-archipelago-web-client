<script setup lang="ts">
import { playSound } from '@/lib/audio';
import { resetCache } from '@/lib/cache';
import { settings } from '@/state/settings';

function clearCache() {
  const confirmation = confirm('Are you sure you want to clear the cache? This will re-download all data packages from the server and reload the page.');
  if (confirmation) {
    resetCache();
    window.location.reload();
  }
}
</script>

<template>
  <div class="inner-container">
    <fieldset>
      <legend><strong>General</strong></legend>
      
      <div class="check-row">
        <input v-model="settings.generalAutoReconnect" type="checkbox" id="attemptReconnect">
        <label for="attemptReconnect">Attempt to reconnect automatically on page refresh</label>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>Notifications</strong></legend>
      <div class="field-row" style="max-width: 300px; margin-bottom: 1em;">
        <label for="volume">Volume:</label>
        <label for="volume">Low</label>
        <input v-model.number="settings.notificationsVolume" id="volume" type="range" min="0" max="1" value="0.5" step="0.1" />
        <label for="volume">High</label>
      </div>

      <div class="check-row">
        <button @click="() => playSound('notify')" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
        <div>
          <input v-model="settings.notificationsItemSent" type="checkbox" id="itemSentNotification">
          <label for="itemSentNotification">Play a sound when someone has sent you an item</label>
        </div>
      </div>

      <div class="check-row">
        <button @click="() => playSound('chimes')" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
        <div>
          <input v-model="settings.notificationsPlayerConnected" type="checkbox" id="connectNotification">
          <label for="connectNotification">Play a sound when someone connects</label>
        </div>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>Misc</strong></legend>
      
      <button @click="clearCache()">Clear cache</button>
    </fieldset>
  </div>
</template>

<style scoped>
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
</style>