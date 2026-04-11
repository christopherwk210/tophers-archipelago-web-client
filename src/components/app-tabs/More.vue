<script setup lang="ts">
import Settings from '@/components/more-tabs/Settings.vue';
import Help from '@/components/more-tabs/Help.vue';
import { TabManager } from '@/lib/tab-manager';
import type { ComponentTab } from '@/state/tabs';
import Accounts from '../more-tabs/Accounts.vue';
import Changes from '../more-tabs/Changes.vue';
import Theme from '../more-tabs/Theme.vue';

const tabManager = new TabManager([
  { label: 'Settings', component: Settings },
  { label: 'Theme', component: Theme },
  { label: 'Accounts', component: Accounts },
  { label: 'Changelog', component: Changes },
  { label: 'Help', component: Help }
] as const satisfies ComponentTab[]);

const Tabs = tabManager.createVueComponent();
</script>

<template>
  <div class="more">
    <Tabs v-slot="{ currentTab }">
      <component :is="currentTab.component" />
    </Tabs>
  </div>
</template>

<style scoped>
.more {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

h4 {
  margin: 0;
}

.inner-container {
  flex: 1;
  overflow: auto;
  padding: 0 0.5em;
}
</style>