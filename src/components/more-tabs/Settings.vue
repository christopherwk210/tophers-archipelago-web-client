<script setup lang="ts">
import { playSound } from '@/lib/audio';
import { resetCache } from '@/lib/cache';
import { settings } from '@/state/settings';
import { useCssVar, useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';
import ThemeSettings from '../ThemeSettings.vue';

function clearCache() {
  const confirmation = confirm('Are you sure you want to clear the cache? This will re-download all data packages from the server and reload the page.');
  if (confirmation) {
    resetCache();
    window.location.reload();
  }
}

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
    <fieldset>
      <legend><strong>General</strong></legend>

      <div style="margin-top: 0.5em" class="check-row">
        <input v-model="settings.generalAutoReconnect" type="checkbox" id="attemptReconnect">
        <label for="attemptReconnect">Attempt to reconnect automatically on page refresh</label>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <input v-model="settings.generalShowPlayerTooltips" type="checkbox" id="enablePlayerTooltips">
        <label for="enablePlayerTooltips">Enable player tooltips</label>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <input v-model="settings.generalShowItemTooltips" type="checkbox" id="enableItemTooltips">
        <label for="enableItemTooltips">Enable item tooltips</label>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>Notifications</strong></legend>
      <label style="margin-bottom: 0.5em" for="volume">Volume:</label>
      <div class="field-row" style="max-width: 300px; margin-bottom: 1em;">
        <label for="volume">Low</label>
        <input v-model.number="settings.notificationsVolume" id="volume" type="range" min="0" max="1" value="0.5" step="0.1" />
        <label for="volume">High</label>
      </div>

      <div class="check-row">
        <button @click="() => playSound('chimes')" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
        <div>
          <input v-model="settings.notificationsPlayerConnected" type="checkbox" id="connectNotification">
          <label for="connectNotification">Play a sound when someone connects</label>
        </div>
      </div>

      <div class="check-row">
        <button @click="() => playSound('notify')" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
        <div>
          <input v-model="settings.notificationsItemSent" type="checkbox" id="itemSentNotification">
          <label for="itemSentNotification">Play a sound when someone has sent you an item</label>
        </div>
      </div>

      <div style="margin-top: 1em">
        <label>Only notify me for these types of items:</label>
  
        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentNormal" type="checkbox" id="itemSentNotificationNormal">
            <label for="itemSentNotificationNormal">Normal</label>
          </div>
        </div>

        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentUseful" type="checkbox" id="itemSentNotificationUseful">
            <label for="itemSentNotificationUseful">Useful</label>
          </div>
        </div>

        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentProgression" type="checkbox" id="itemSentNotificationProgression">
            <label for="itemSentNotificationProgression">Progression</label>
          </div>
        </div>

        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentTrap" type="checkbox" id="itemSentNotificationTrap">
            <label for="itemSentNotificationTrap">Trap</label>
          </div>
        </div>
      </div>
    </fieldset>

    <ThemeSettings />

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