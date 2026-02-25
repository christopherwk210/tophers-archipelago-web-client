<script setup lang="ts">
import { useRouter } from 'vue-router';
import { appTabManager } from '@/state/tabs';
import { self } from '@/state/self';
import { updatePackageCache } from '@/lib/cache';

const router = useRouter();

function logout() {
  router.push('/');
}

const Tabs = appTabManager.createVueComponent();

updatePackageCache();
</script>

<template>
  <div class="connected">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">Topher's Archipelago Web Client <span style="margin: 0 1em">|</span> <em style="font-weight: 400;">{{ self.slot }}</em></div>
        <div class="title-bar-controls">
          <button @click="logout" style="padding: 0.2rem 0.5rem">Logout</button>
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