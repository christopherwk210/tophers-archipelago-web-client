<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { client } from './archipelago';
import BuyItemHintModal from './components/BuyItemHintModal.vue';

const route = useRoute();
const router = useRouter();
</script>

<template>
  <RouterView />
  <BuyItemHintModal />
</template>

<style scoped></style>
