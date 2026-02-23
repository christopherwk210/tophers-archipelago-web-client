<script setup lang="ts">
import { state } from '@/state';
import { computed, ref } from 'vue';

const selectedRow = ref(-1);
const sortBy = ref<'name' | 'game' | 'status' | 'team'>('status');
const sortOrder = ref<'asc' | 'desc'>('asc');
const sortedPlayers = computed(() => {
  return [...state.value.players].sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1;
    if (a[sortBy.value] < b[sortBy.value]) return -1 * modifier;
    if (a[sortBy.value] > b[sortBy.value]) return 1 * modifier;
    return 0;
  });
});

function sortByColumn(column: 'name' | 'game' | 'status' | 'team') {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
}
</script>

<template>
  <div class="players">
    <template v-if="state.players.length === 0">
      <p>Loading players, please wait...</p>
    </template>
    <div class="sunken-panel" v-else>
      <table class="interactive">
        <thead>
          <tr>
            <th @click="sortByColumn('team')">Team</th>
            <th @click="sortByColumn('name')">Name</th>
            <th @click="sortByColumn('status')">Status</th>
            <th @click="sortByColumn('game')">Game</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) of sortedPlayers" @click="selectedRow = index" :class="{ highlighted: selectedRow === index }">
            <td style="text-align: center">{{ player.team + 1 }}</td>
            <td><strong>{{ player.name }}</strong></td>
            <td><span :class="[player.status]">{{ player.status }}</span></td>
            <td>{{ player.game }}</td>
          </tr>
        </tbody>
      </table>
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

table {
  width: 100%;
}

.sunken-panel {
  flex: 1;
}

thead {
  user-select: none;
}

tr {
  cursor: pointer;
}

td {
  padding: 0.5em;
}

th:hover {
  background: #dfdfdf;
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