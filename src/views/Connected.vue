<script setup lang="ts">
import { useRouter } from 'vue-router';
import { appTabManager } from '@/state/tabs';
import { self } from '@/state/self';
import { updatePackageCache } from '@/lib/cache';
import { loadHints } from '@/state/hints';
import { loadCollectedItems } from '@/state/tracker';
import { useIntervalFn } from '@vueuse/core';
import { client } from '@/lib/archipelago';
import { AppStorage } from '@/lib/storage';
import { settings } from '@/state/settings';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { localAccounts } from '@/lib/accounts';
import MouseToast from '@/components/MouseToast.vue';
import { initKonami, uninitKonami } from '@/lib/easter-egg';

const router = useRouter();

function logout() {
  router.push('/');
}

const Tabs = appTabManager.createVueComponent();

// Initialization
async function init() {
  await updatePackageCache();
  loadHints();
  loadCollectedItems();
}

// Every 20 minutes, check if we're still logged in
useIntervalFn(() => {
  if (!client.authenticated || !client.socket.connected) {
    if (!settings.value.generalAutoReconnect) {
      router.push('/');
    } else {
      const url = AppStorage.get('url');
      const slot = AppStorage.get('slot');
      const password = AppStorage.get('password');

      router.push({ name: 'Login', query: { url, slot, password } });
    }
  }
}, 1000 * 60 * 20);

const hasMultipleAccounts = computed(() => localAccounts.value.length > 1);
const switchAccountList = computed(() => {
  const currentSlot = self.slot;
  const currentURL = AppStorage.get('url');

  // Filter out any accounts that have both the same slot & URL
  // It's okay if JUST the url is the same or JUST the slot is the same, but if BOTH are the same, we want to filter it out
  return localAccounts.value.filter(account => !(account.slot === currentSlot && account.url === currentURL));
});

const accountSwitcher = ref(-1);
watch(accountSwitcher, () => {
  if (accountSwitcher.value === -2) {
    logout();
  } else {
    const selectedAccount = switchAccountList.value[accountSwitcher.value];
    if (selectedAccount) {
      router.push({ name: 'Login', query: { url: selectedAccount.url, slot: selectedAccount.slot, password: selectedAccount.password } });
    }
  }
});

init();

initKonami();
onBeforeUnmount(() => uninitKonami());
</script>

<template>
  <div class="connected">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">
          Topher's Archipelago Web Client
          <span style="margin: 0 1em">|</span> <em style="font-weight: 400;">{{ self.slot }}</em>
        </div>
        <div class="title-bar-controls">
          <select v-model="accountSwitcher" v-if="hasMultipleAccounts" style="width: 160px">
            <option disabled :value="-1">Switch account...</option>
            <option v-for="(account, accountIndex) of switchAccountList" :value="accountIndex">{{ account.slot }}</option>
            <option :value="-2">Logout</option>
          </select>
          <button v-else @click="logout" style="padding: 0.2rem 0.5rem">Logout</button>
        </div>
      </div>
      <div class="window-body">
        <Tabs v-slot="{ currentTab }">
          <KeepAlive>
            <component :is="currentTab.component" />
          </KeepAlive>
        </Tabs>
      </div>
    </div>

    <MouseToast />
  </div>
</template>

<style scoped>
.connected {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: relative;
  background: #11007b;
  padding: 1em;
  overflow: hidden;
}

.window {
  flex: 1;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.window-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow: auto;
  height: 100%;
  margin-bottom: 0.5em;
  padding-right: 0.5em;
}

input {
  width: 100%;
}

.message {
  margin-bottom: 0.5em;
  white-space: pre-wrap;
}

@media (max-width: 500px) {
  .connected {
    padding: 0;
  }
}

@media (max-height: 500px) {
  .connected {
    padding: 0;
  }
}
</style>