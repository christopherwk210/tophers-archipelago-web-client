<script setup lang="ts">
import { onActivated } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { loadLocations, tracker } from '@/state/tracker';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';

onActivated(() => {
  loadLocations();
});

const columns: Column[] = [
  { label: 'Checked', key: 'checked' },
  { label: 'Name', key: 'name' }
];
</script>

<template>
  <div class="locations">
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="tracker.locations" default-sort-by="checked">
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
</style>