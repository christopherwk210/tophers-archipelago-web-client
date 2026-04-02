<script setup lang="ts">
import BuyItemHintModal from '@/components/modals/BuyItemHintModal.vue';
import BuyLocationHintModal from '@/components/modals/BuyLocationHintModal.vue';
import ExportThemeModal from './components/modals/ExportThemeModal.vue';
import EditAccountModal from './components/modals/EditAccountModal.vue';
import { initializeCustomCommands } from './lib/commands';

initializeCustomCommands();
</script>

<template>
  <RouterView />

  <BuyItemHintModal />
  <BuyLocationHintModal />
  <ExportThemeModal />
  <EditAccountModal />
</template>

<style scoped></style>
