<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { client } from './archipelago';

const route = useRoute();
const router = useRouter();

// client.messages.on('disconnected', () => {
//   if (route.name === 'Connected') {
//     const localStorageKey = 'tawc';
//     const url = localStorage.getItem(`${localStorageKey}:url`) || '';
//     const slot = localStorage.getItem(`${localStorageKey}:slot`) || '';
//     const password = localStorage.getItem(`${localStorageKey}:password`) || '';

//     const queryParams = new URLSearchParams();
//     queryParams.set('url', url);
//     queryParams.set('slot', slot);
//     if (password) {
//       queryParams.set('password', password);
//     }

//     router.push(`/?${queryParams.toString()}`);
//   }
// })
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
