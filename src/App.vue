<script setup lang="ts">
import BuyItemHintModal from '@/components/modals/BuyItemHintModal.vue';
import BuyLocationHintModal from '@/components/modals/BuyLocationHintModal.vue';
import ExportThemeModal from './components/modals/ExportThemeModal.vue';
</script>

<template>
  <RouterView />

  <BuyItemHintModal />
  <BuyLocationHintModal />
  <ExportThemeModal />
</template>

<style scoped></style>
