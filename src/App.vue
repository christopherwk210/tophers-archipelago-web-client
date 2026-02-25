<script setup lang="ts">
import BuyItemHintModal from './components/BuyItemHintModal.vue';
import { watch } from 'vue';
import { settings } from './state/settings';
import { AppStorage } from './lib/storage';

// Automatically store settings when they change
watch(settings, () => {
  AppStorage.setJSON('settings', settings.value);
  Howler.volume(settings.value.notificationsVolume);
}, { deep: true });
</script>

<template>
  <RouterView />
  <BuyItemHintModal />
</template>

<style scoped></style>
