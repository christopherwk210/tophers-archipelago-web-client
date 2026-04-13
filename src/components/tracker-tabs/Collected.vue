<script setup lang="ts">
import { computed, onActivated, ref } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { loadCollectedItems, tracker } from '@/state/tracker';
import check from '@/assets/icons/check.png';
import PlayerName from '../text-elements/PlayerName.vue';
import ItemName from '../text-elements/ItemName.vue';
import { settings } from '@/state/settings';
import type { ItemClass } from '@/lib/archipelago';

onActivated(() => {
  loadCollectedItems();
});

const columns: Column[] = [
  { label: '', key: '_check_image' },
  { label: 'Order', key: 'order' },
  { label: 'Name', key: 'name' },
  { label: 'Sender', key: 'sender' },
  { label: 'Source Game', key: 'locationGame' },
  { label: 'Location', key: 'location' }
];

const search = ref('');
const filteredCollected = computed(() => {
  return tracker.collected.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()));
});

const simplifiedColumns: Column[] = [
  { label: 'Quantity', key: 'count', style: 'width: 80px' },
  { label: 'Name', key: 'name' }
];

const simplifiedCollected = computed(() => {
  const itemCounts: Record<string, { count: number; iclass: ItemClass[]; }> = {};

  for (const item of tracker.collected) {
    itemCounts[item.name] = itemCounts[item.name] || { count: 0, iclass: item.class };
    itemCounts[item.name]!.count++;
  }

  return Object.entries(itemCounts).map(([name, { count, iclass }]) => ({
    name,
    count,
    iclass
  })).filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()));
});
</script>

<template>
  <div class="collected">
    <div>
      <input v-model="search" style="margin-right: auto" placeholder="Search items by name..." type="text">
      <div class="check-row" style="margin: 0.5em 0;">
        <input v-model="settings.trackerCollectedSimplified" type="checkbox" id="simplified">
        <label for="simplified">Simplified view</label>
      </div>
    </div>
    <div class="sunken-panel">
      <AppTable v-if="settings.trackerCollectedSimplified" :columns="simplifiedColumns" :data="simplifiedCollected" default-sort-by="count" default-sort-order="desc">
        <template #count="{ item }">
          <td style="text-align: center">{{ item.count }}</td>
        </template>

        <template #name="{ item }">
          <td><ItemName :iclass="item.iclass" :name="item.name" /></td>
        </template>
      </AppTable>
      <AppTable v-else :columns="columns" :data="filteredCollected" default-sort-by="order" default-sort-order="desc">
        <template #_check_image="{ item }">
          <td><img :src="check"></td>
        </template>

        <template #sender="{ item }">
          <td><PlayerName :alias="item.sender" :slot="item.senderSlot" :game="item.senderGame" /></td>
        </template>

        <template #location="{ item }">
          <td style="color: var(--theme-location)">{{ item.location }}</td>
        </template>

        <template #name="{ item }">
          <td><ItemName :iclass="item.class" :name="item.name" /></td>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
.collected {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
}

.sunken-panel {
  flex: 1;
}

td {
  padding: 0.5em;
}

input {
  padding: 0 0.5em !important;
  width: 100%;
}
</style>