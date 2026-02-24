<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { client } from './archipelago';
import BuyItemHintModal from './components/BuyItemHintModal.vue';
import { watch } from 'vue';
import { settings } from './state';

const localStorageKey = 'tawc:user-settings';

watch(settings, () => {
  localStorage.setItem(localStorageKey, JSON.stringify(settings.value));
  Howler.volume(settings.value.notificationsVolume);
}, { deep: true });
</script>

<template>
  <RouterView />
  <BuyItemHintModal />
</template>

<style scoped></style>
