<script setup lang="ts">
import { TabManager } from '@/lib/tab-manager';
import type { ComponentTab } from '@/state/tabs';
import Collected from '@/components/tracker-tabs/Collected.vue';
import Locations from '@/components/tracker-tabs/Locations.vue';
import { computed, onActivated } from 'vue';
import { loadLocations, tracker } from '@/state/tracker';

const totalLocations = computed(() => tracker.locations.length);
const totalCheckedLocations = computed(() => tracker.locations.filter(loc => loc.checked).length);
const locationsLabel = computed(() => `Locations (${totalCheckedLocations.value} / ${totalLocations.value})`)

onActivated(() => {
  // We need to load locations when the tracker tab loads so that the tab label is updated properly
  loadLocations();
});

const tabManager = new TabManager([
  { label: 'Collected', component: Collected },
  { label: locationsLabel, component: Locations }
] as const satisfies ComponentTab[]);

const Tabs = tabManager.createVueComponent();
</script>

<template>
  <div class="tracker">
    <Tabs v-slot="{ currentTab }">
      <KeepAlive>
        <component :is="currentTab.component" />
      </KeepAlive>
    </Tabs>
  </div>
</template>

<style scoped>
.tracker {
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>