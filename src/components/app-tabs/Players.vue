<script setup lang="ts">
import { loadPlayers, players } from '@/state/players';
import { onActivated } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';

onActivated(async () => {
  loadPlayers();
});

const columns: Column[] = [
  { label: 'Team', key: 'team' },
  { label: 'Name', key: 'name' },
  { label: 'Status', key: 'status' },
  { label: 'Game', key: 'game' }
];
</script>

<template>
  <div class="players">
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="players" default-sort-by="status">
        <template #team="{ item }">
          <td style="text-align: center">{{ item.team + 1 }}</td>
        </template>

        <template #name="{ item }">
          <td><strong>{{ item.name }}</strong></td>
        </template>

        <template #status="{ item }">
          <td><span :class="[item.status]">{{ item.status }}</span></td>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
.players {
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

.Disconnected {
  color: red;
  font-weight: bold;
}

.Completed {
  color: blue;
  font-weight: bold;
}

.Connected {
  color: green;
  font-weight: bold;
}
</style>