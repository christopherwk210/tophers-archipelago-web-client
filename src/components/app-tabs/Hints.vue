<script setup lang="ts">
import { computed, onActivated } from 'vue';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';
import { ui } from '@/state/ui';
import { hints, loadHints } from '@/state/hints';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { settings } from '@/state/settings';
import { getPlayerStyles, getItemStyles } from '@/lib/theme';
import PlayerName from '../text-elements/PlayerName.vue';
import ItemName from '../text-elements/ItemName.vue';

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

const filteredHints = computed(() => {
  if (settings.value.hintsFilterFound) {
    return hints.list.filter(hint => !hint.found);
  }
  return hints.list;
});
</script>

<template>
  <div class="hints">
    <div class="actions">
      <button :disabled="hints.points < hints.cost" @click="ui.modals.buyItemHint = true">Buy item hint</button>
      <div class="check-row" style="margin: 0.5em 0;">
        <input v-model="settings.hintsFilterFound" type="checkbox" id="filterFound">
        <label for="filterFound">Hide found hints</label>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 0.875em;">
      <span>Hint cost: {{ hints.cost }}</span>
      <span>Available points: {{ hints.points }}</span>
    </div>
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="filteredHints" default-sort-by="player">
        <template #found="{ item }">
          <td style="text-align: center"><img :src="item.found ? check : minus"></td>
        </template>

        <template #player="{ item }">
          <td><PlayerName :alias="item.player" :slot="item.slot" :game="item.game" /></td>
        </template>

        <template #owner="{ item }">
          <td><PlayerName :alias="item.owner" :slot="item.ownerSlot" :game="item.ownerGame" /></td>
        </template>

        <template #item="{ item }">
          <td><ItemName :iclass="item.itemClass" :name="item.item" /></td>
        </template>

        <template #location="{ item }">
          <td style="color: var(--theme-location)">{{ item.location }}</td>
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

.actions {
  display: flex;
  justify-content: space-between;
}
</style>