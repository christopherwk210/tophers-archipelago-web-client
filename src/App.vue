<script setup lang="ts">
import BuyItemHintModal from '@/components/modals/BuyItemHintModal.vue';
import BuyLocationHintModal from '@/components/modals/BuyLocationHintModal.vue';
import ExportThemeModal from './components/modals/ExportThemeModal.vue';
import EditAccountModal from './components/modals/EditAccountModal.vue';
import { initializeCustomCommands } from './lib/commands';
import { watch } from 'vue';
import { settings } from './state/settings';
import DesignWindow from './components/DesignWindow.vue';
import { translateInternals } from './lib/localization-util';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

translateInternals();
initializeCustomCommands();

watch(() => settings.value.notificationsUseDesktop, () => {
  if (settings.value.notificationsUseDesktop && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}, { immediate: true });

watch(locale, () => {
  settings.value.generalSelectedLocale = locale.value;
});

watch(locale, () => {
  document.documentElement.lang = locale.value;
}, { immediate: true });
</script>

<template>
  <RouterView />

  <BuyItemHintModal />
  <BuyLocationHintModal />
  <ExportThemeModal />
  <EditAccountModal />
  <DesignWindow />
</template>

<style scoped></style>
