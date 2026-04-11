<script setup lang="ts">
import BuyItemHintModal from '@/components/modals/BuyItemHintModal.vue';
import BuyLocationHintModal from '@/components/modals/BuyLocationHintModal.vue';
import ExportThemeModal from './components/modals/ExportThemeModal.vue';
import EditAccountModal from './components/modals/EditAccountModal.vue';
import { initializeCustomCommands } from './lib/commands';
import { watch } from 'vue';
import { settings } from './state/settings';
import DesignWindow from './components/DesignWindow.vue';

initializeCustomCommands();

watch(() => settings.value.notificationsUseDesktop, () => {
  if (settings.value.notificationsUseDesktop && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
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
