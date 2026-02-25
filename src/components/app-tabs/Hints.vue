<script setup lang="ts">
import { onActivated } from 'vue';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';
import { ui } from '@/state/ui';
import { hints, loadHints } from '@/state/hints';
import AppTable, { type Column } from '@/components/AppTable.vue';

onActivated(async () => {
  loadHints();
});

const columns: Column[] = [
  { label: 'Found', key: 'found' },
  { label: 'Player', key: 'player' },
  { label: 'Item', key: 'item' },
  { label: 'Owner', key: 'owner' },
  { label: 'Location', key: 'location' }
];
</script>

<template>
  <div class="hints">
    <div>
      <button :disabled="hints.points < hints.cost" @click="ui.modals.buyItemHint = true">Buy item hint</button>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 14px">
      <span>Hint cost: {{ hints.cost }}</span>
      <span>Available points: {{ hints.points }}</span>
    </div>
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="hints.list" default-sort-by="player">
        <template #found="{ item }">
          <td style="text-align: center"><img :src="item.found ? check : minus"></td>
        </template>

        <template #player="{ item }">
          <td><strong>{{ item.player }}</strong></td>
        </template>

        <template #owner="{ item }">
          <td><strong>{{ item.owner }}</strong></td>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
.hints {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
}

.sunken-panel {
  flex: 1;
}
</style>