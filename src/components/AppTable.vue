<script setup lang="ts">
import { computed, ref } from 'vue';

export interface Column {
  label: string;
  key: string;
  sortable?: boolean;
}

const props = withDefaults(defineProps<{
  columns: Column[];
  data: any[];
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
}>(), {
  defaultSortOrder: 'asc'
});

const selectedRow = ref(-1);
const sortBy = ref<string>(props.defaultSortBy || props.columns[0]?.key || '');
const sortOrder = ref<'asc' | 'desc'>(props.defaultSortOrder || 'asc');
const sortedData = computed(() => {
  return [...props.data].sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1;
    if (a[sortBy.value] < b[sortBy.value]) return -1 * modifier;
    if (a[sortBy.value] > b[sortBy.value]) return 1 * modifier;
    return 0;
  });
});

function sortByColumn(column: string) {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
}
</script>

<template>
  <table class="app-table">
    <thead>
      <tr>
        <th v-for="column of columns" @click="column.sortable !== false ? sortByColumn(column.key) : () => {}">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of sortedData" @click="selectedRow = index" :class="{ highlighted: selectedRow === index }">
        <slot :name="column.key" :item="item" v-for="column of columns">
          <td>{{ item[column.key] }}</td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>