<script setup lang="ts">
import { onActivated } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { loadCollectedItems, tracker } from '@/state/tracker';
import check from '@/assets/icons/check.png';
import PlayerName from '../text-elements/PlayerName.vue';
import ItemName from '../text-elements/ItemName.vue';

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
</script>

<template>
  <div class="collected">
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="tracker.collected" default-sort-by="order" default-sort-order="desc">
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
</style>