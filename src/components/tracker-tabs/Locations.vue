<script setup lang="ts">
import { onActivated, ref } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { loadLocations, tracker, type TrackerLocation } from '@/state/tracker';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';
import { ui } from '@/state/ui';

onActivated(() => {
  loadLocations();
});

const columns: Column[] = [
  { label: 'Checked', key: 'checked' },
  { label: 'Name', key: 'name' }
];

const selectedLocation = ref<TrackerLocation>();

function buyLocationHint() {
  if (!selectedLocation.value) return;
  ui.modals.buyLocationHint = selectedLocation.value;
}
</script>

<template>
  <div class="locations">
    <div class="actions">
      <em v-if="!selectedLocation">Select a location</em>
      <span v-else>{{ selectedLocation.name }}</span>
      <button :disabled="!selectedLocation" @click="buyLocationHint()">Buy location hint</button>
    </div>
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="tracker.locations" default-sort-by="checked" @row-selected="selectedLocation = $event">
        <template #checked="{ item }">
          <td style="text-align: center"><img :src="item.checked ? check : minus"></td>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
.locations {
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

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1em;
}

.actions button {
  padding: 0.5em 1em;
}

.actions em {
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
}
</style>