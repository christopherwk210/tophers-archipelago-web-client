<script setup lang="ts">
import { watch } from 'vue';
import { settings } from '@/state/settings';
import { AppStorage } from '@/lib/storage';
import BuyItemHintModal from '@/components/modals/BuyItemHintModal.vue';
import BuyLocationHintModal from '@/components/modals/BuyLocationHintModal.vue';

// Automatically store settings when they change
watch(settings, () => {
  AppStorage.setJSON('settings', settings.value);
  Howler.volume(settings.value.notificationsVolume);
}, { deep: true });
</script>

<template>
  <RouterView />

  <BuyItemHintModal />
  <BuyLocationHintModal />
</template>

<style scoped></style>
