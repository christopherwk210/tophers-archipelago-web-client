<script setup lang="ts">
import { playSound } from '@/lib/audio';
import { resetCache } from '@/lib/cache';
import { settings } from '@/state/settings';
import { useCssVar, useDebounceFn } from '@vueuse/core';
import { ref, watch } from 'vue';
import ChatSettings from './Settings/ChatSettings.vue';
import { useLocalization } from '@/lib/localization-util';
import { useI18n } from 'vue-i18n';
import { i18n_messages } from '@/localization';

const { t } = useLocalization();

function clearCache() {
  const confirmation = confirm(t('Settings.settingsClearCache'));
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
      <legend><strong>{{ t('Settings.settingsGeneral') }}</strong></legend>

      <div style="margin-top: 0.5em">
        <label for="language">{{ t('Settings.settingsLanguage') }}</label>
        <select id="language" style="display: block; width: 100%; max-width: 300px; margin-top: 0.25em;" v-model="$i18n.locale">
          <option v-for="locale in $i18n.availableLocales" :value="locale">{{ (i18n_messages as any)[locale]['MiscUI']['languageName'] }}</option>
        </select>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <input v-model="settings.generalAutoReconnect" type="checkbox" id="attemptReconnect">
        <label for="attemptReconnect">{{ t('Settings.settingsReconnectOnRefresh') }}</label>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <input v-model="settings.lazyLoadTables" type="checkbox" id="lazyLoadTables">
        <label :data-tippy-content="t('Settings.settingsLazyLoadTooltip')" for="lazyLoadTables">{{ t('Settings.settingsLazyLoad') }}</label>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>{{ t('Settings.settingsUi') }}</strong></legend>

      <div style="margin-top: 0.5em" class="check-row">
        <input v-model="settings.generalShowPlayerTooltips" type="checkbox" id="enablePlayerTooltips">
        <label for="enablePlayerTooltips">{{ t('Settings.settingsPlayerTooltips') }}</label>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <input v-model="settings.generalShowItemTooltips" type="checkbox" id="enableItemTooltips">
        <label for="enableItemTooltips">{{ t('Settings.settingsItemTooltips') }}</label>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <input v-model="settings.uiShowUrlTitle" type="checkbox" id="showConnectionURL">
        <label for="showConnectionURL">{{ t('Settings.settingsShowConnectionURL') }}</label>
      </div>
    </fieldset>

    <ChatSettings />

    <fieldset class="mt-3">
      <legend><strong>{{ t('Settings.settingsHints') }}</strong></legend>

      <div style="margin-top: 0.5em" class="check-row">
        <input v-model="settings.hintsFilterFound" type="checkbox" id="hintsFilterFound">
        <label for="hintsFilterFound">{{ t('Hints.hintsHideFoundHints') }}</label>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <input v-model="settings.hintCopyButtonEnabled" type="checkbox" id="hintCopyButtonEnabled">
        <label :data-tippy-content="t('Settings.settingsEnableCopyBtnTooltip')" for="hintCopyButtonEnabled">{{ t('Settings.settingsEnableCopyBtn') }}</label>
      </div>

      <div style="margin-top: 1em">
        <label for="copyLanguage">{{ t('Settings.settingsCopyLanguage') }}</label>
        <select id="copyLanguage" style="display: block; width: 100%; max-width: 300px; margin-top: 0.25em;" v-model="settings.hintCopyLanguage">
          <option value="default">{{ t('MiscUI.default') }}</option>
          <option v-for="locale in $i18n.availableLocales" :value="locale">{{ (i18n_messages as any)[locale]['MiscUI']['languageName'] }}</option>
        </select>
      </div>

      <div style="margin-top: 1em" class="check-row">
        <label>{{ t('Settings.settingsCopyHintAs') }}</label>
      </div>
      <div class="field-row radio-row">
        <input v-model="settings.hintCopyType" value="markdown" id="markdown" type="radio" name="markdown">
        <!-- <label data-tippy-maxWidth="none" :data-tippy-content="t('Settings.settingsCopyMarkdownTooltip')" for="markdown">{{ t('Settings.settingsCopyMarkdown') }}</label> -->
        <label data-tippy-maxWidth="none" :data-tippy-content="settings.hintCopyLanguage === 'default' ? t('Settings.settingsCopyMarkdownTooltip') : (i18n_messages as any)[settings.hintCopyLanguage]['Settings']['settingsCopyMarkdownTooltip']" for="markdown">{{ t('Settings.settingsCopyMarkdown') }}</label>
      </div>
      <div class="field-row radio-row">
        <input v-model="settings.hintCopyType" value="plain" id="plain" type="radio" name="plain">
        <!-- <label data-tippy-maxWidth="none" :data-tippy-content="t('Settings.settingsCopyBasicTooltip')" for="plain">{{ t('Settings.settingsCopyBasic') }}</label> -->
        <label data-tippy-maxWidth="none" :data-tippy-content="settings.hintCopyLanguage === 'default' ? t('Settings.settingsCopyBasicTooltip') : (i18n_messages as any)[settings.hintCopyLanguage]['Settings']['settingsCopyBasicTooltip']" for="plain">{{ t('Settings.settingsCopyBasic') }}</label>
      </div>
      <div class="field-row radio-row">
        <input v-model="settings.hintCopyType" value="item-name" id="item-name" type="radio" name="item-name">
        <!-- <label :data-tippy-content="t('Settings.settingsCopyItemTooltip')" for="item-name">{{ t('Settings.settingsCopyItem') }}</label> -->
        <label :data-tippy-content="settings.hintCopyLanguage === 'default' ? t('Settings.settingsCopyItemTooltip') : (i18n_messages as any)[settings.hintCopyLanguage]['Settings']['settingsCopyItem']" for="item-name">{{ t('Settings.settingsCopyItem') }}</label>
      </div>
      <div class="field-row radio-row">
        <input v-model="settings.hintCopyType" value="ascii" id="ascii" type="radio" name="ascii">
        <!-- <label data-tippy-maxWidth="none" :data-tippy-content="t('Settings.settingsCopyScreamTooltip')" for="ascii">{{ t('Settings.settingsCopyScream') }}</label> -->
        <label data-tippy-maxWidth="none" :data-tippy-content="settings.hintCopyLanguage === 'default' ? t('Settings.settingsCopyScreamTooltip') : (i18n_messages as any)[settings.hintCopyLanguage]['Settings']['settingsCopyScreamTooltip']" for="ascii">{{ t('Settings.settingsCopyScream') }}</label>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>{{ t('Settings.settingsNotifications') }}</strong></legend>
      <div style="margin-top: 0.5em; margin-bottom: 1em" class="check-row">
        <input v-model="settings.notificationsUseDesktop" type="checkbox" id="notificationUseDesktop">
        <label for="notificationUseDesktop" :data-tippy-content="t('Settings.settingsDesktopNotificationsTooltip')">{{ t('Settings.settingsDesktopNotifications') }}</label>
      </div>

      <label style="margin-bottom: 0.5em; font-size: 0.95em" for="volume">{{ t('Settings.settingsVolume') }}</label>
      <div class="field-row" style="max-width: 300px; margin-bottom: 1em;">
        <label for="volume">{{ t('Settings.settingsVolumeLow') }}</label>
        <input v-model.number="settings.notificationsVolume" id="volume" type="range" min="0" max="1" value="0.5" step="0.1" />
        <label for="volume">{{ t('Settings.settingsVolumeHigh') }}</label>
      </div>

      <div class="check-row">
        <button @click="() => playSound('chimes')" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
        <div>
          <input v-model="settings.notificationsPlayerConnected" type="checkbox" id="connectNotification">
          <label for="connectNotification">{{ t('Settings.settingsNotifyConnect') }}</label>
        </div>
      </div>

      <div class="check-row">
        <button @click="() => playSound('notify')" class="audio-play-btn"><img src="@/assets/icons/speaker.png"></button>
        <div>
          <input v-model="settings.notificationsItemSent" type="checkbox" id="itemSentNotification">
          <label for="itemSentNotification">{{ t('Settings.settingsNotifyItemSent') }}</label>
        </div>
      </div>

      <div style="margin-top: 1em">
        <label>{{ t('Settings.settingsNotifyItemTypes') }}</label>
  
        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentNormal" type="checkbox" id="itemSentNotificationNormal">
            <label for="itemSentNotificationNormal">{{ t('Texts.textItemNormal') }}</label>
          </div>
        </div>

        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentUseful" type="checkbox" id="itemSentNotificationUseful">
            <label for="itemSentNotificationUseful">{{ t('Texts.textItemUseful') }}</label>
          </div>
        </div>

        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentProgression" type="checkbox" id="itemSentNotificationProgression">
            <label for="itemSentNotificationProgression">{{ t('Texts.textItemProgression') }}</label>
          </div>
        </div>

        <div class="check-row" style="padding-left: 1em; margin-top: 0.5em">
          <div>
            <input :disabled="!settings.notificationsItemSent" v-model="settings.notificationsItemSentTrap" type="checkbox" id="itemSentNotificationTrap">
            <label for="itemSentNotificationTrap">{{ t('Texts.textItemTrap') }}</label>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>{{ t('Settings.settingsMisc') }}</strong></legend>

      <button @click="clearCache()">{{ t('Settings.settingsClearCacheBtn') }}</button>
      <a target="_blank" href="https://github.com/christopherwk210/tophers-archipelago-web-client" style="margin-left: 1em;"><button>{{ t('Settings.settingsViewSourceCode') }}</button></a>
    </fieldset>
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