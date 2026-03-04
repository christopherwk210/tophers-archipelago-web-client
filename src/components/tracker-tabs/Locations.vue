<script setup lang="ts">
import { computed, onActivated, ref } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { loadLocations, tracker, type TrackerLocation } from '@/state/tracker';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';
import { ui } from '@/state/ui';
import { settings } from '@/state/settings';

onActivated(() => {
  loadLocations();
});

const columns: Column[] = [
  { label: 'Checked', key: 'checked', style: 'width: 100px;' },
  { label: 'Name', key: 'name' }
];

const selectedLocation = ref<TrackerLocation>();

function buyLocationHint() {
  if (!selectedLocation.value) return;
  ui.modals.buyLocationHint = selectedLocation.value;
}

const search = ref('');
const filteredLocations = computed(() => {
  const filteredLocations = tracker.locations.filter(location => location.name.toLowerCase().includes(search.value.toLowerCase()));

  if (settings.value.locationHintFilterFound) {
    return filteredLocations.filter(location => !location.checked);
  }

  return filteredLocations;
});
</script>

<template>
  <div class="locations">
    <div class="actions">
      <div class="check-row" style="margin-right: auto">
        <input v-model="settings.locationHintFilterFound" type="checkbox" id="filterFound">
        <label for="filterFound">Hide checked locations</label>
      </div>

      <em v-if="!selectedLocation">Select a location</em>
      <span v-else>{{ selectedLocation.name }}</span>
      <button :disabled="!selectedLocation" @click="buyLocationHint()">Buy location hint</button>
    </div>
    <div>
      <input v-model="search" style="margin-right: auto" placeholder="Search locations..." type="text">
    </div>
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="filteredLocations" default-sort-by="checked" @row-selected="selectedLocation = $event">
        <template #checked="{ item }">
          <td style="text-align: center"><img :src="item.checked ? check : minus"></td>
        </template>

        <template #name="{ item }">
          <td style="color: var(--theme-location)">{{ item.name }}</td>
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

input {
  padding: 0 0.5em !important;
  width: 100%;
}
</style>