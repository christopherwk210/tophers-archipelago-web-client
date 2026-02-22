<script setup lang="ts">
import { state } from '@/state';
import { computed, ref } from 'vue';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';

const selectedRow = ref(-1);
const sortBy = ref<'found' | 'player' | 'item' | 'location'>('player');
const sortOrder = ref<'asc' | 'desc'>('asc');
const sortedHints = computed(() => {
  return [...state.value.hints].sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1;
    if (a[sortBy.value] < b[sortBy.value]) return -1 * modifier;
    if (a[sortBy.value] > b[sortBy.value]) return 1 * modifier;
    return 0;
  });
});

function sortByColumn(column: 'found' | 'player' | 'item' | 'location') {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
}
</script>

<template>
  <div class="hints">
    <div class="sunken-panel">
      <table class="interactive">
        <thead>
          <tr>
            <th @click="sortByColumn('found')">Found</th>
            <th @click="sortByColumn('player')">Player</th>
            <th @click="sortByColumn('item')">Item</th>
            <th @click="sortByColumn('location')">Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hint, index) of sortedHints" @click="selectedRow = index" :class="{ highlighted: selectedRow === index }">
            <td><img :src="hint.found ? check : minus"></td>
            <td><strong>{{ hint.player }}</strong></td>
            <td>{{ hint.item }}</td>
            <td v-html="hint.location"></td>
          </tr>
        </tbody>
      </table>
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

thead {
  user-select: none;
}

tr {
  cursor: pointer;
}

th:hover {
  background: #dfdfdf;
}
</style>