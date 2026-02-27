<script setup lang="ts">
import { loadPlayers, players } from '@/state/players';
import { onActivated } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { getPlayerStyles } from '@/lib/theme';
import PlayerName from '../text-elements/PlayerName.vue';

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
      <div v-if="players.length === 0">
        <p class="loading">Loading players...</p>
      </div>
      <AppTable v-else :columns="columns" :data="players" default-sort-by="status">
        <template #team="{ item }">
          <td style="text-align: center">{{ item.team + 1 }}</td>
        </template>

        <template #name="{ item }">
          <td><PlayerName :alias="item.name" :slot="item.slot" :game="item.game" /></td>
          <!-- <td><strong :style="getPlayerStyles(item.name)">{{ item.name }}</strong></td> -->
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

.loading {
  text-align: center;
  font-size: 1.2rem;
  opacity: 0.8;
  pointer-events: none;
  user-select: none;
}
</style>