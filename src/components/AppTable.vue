<script setup lang="ts">
import { settings } from '@/state/settings';
import { useVirtualList } from '@vueuse/core';
import { computed, ref, watchEffect } from 'vue';

export interface Column {
  label: string;
  key: string;
  sortable?: boolean;
  style?: string;
}

const emit = defineEmits<{
  (e: 'rowSelected', row: any): void;
  (e: 'rowDoubleClicked', row: any): void;
}>();

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
  const data = props.data;

  return data.slice().sort((a, b) => {
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

function rowClicked(index: number, item: any) {
  selectedRow.value = index;
  emit('rowSelected', item);
}

const { list, containerProps } = useVirtualList(sortedData, {
  itemHeight: 52,
  overscan: 10
});
</script>

<template>
  <table class="app-table">
    <thead>
      <tr>
        <template v-for="column of columns">
          <th :style="column.style || {}" @click="column.sortable !== false ? sortByColumn(column.key) : () => {}">{{ column.label }}</th>
        </template>
      </tr>
    </thead>
    
    <tbody v-if="settings.lazyLoadTables" v-bind="containerProps">
      <tr v-for="(item, index) of list" @dblclick.stop.prevent.capture="emit('rowDoubleClicked', item.data)" @click="rowClicked(index, item.data)" :class="{ highlighted: selectedRow === index }">
        <slot :name="column.key" :item="item.data" v-for="column of columns">
          <td>{{ item.data[column.key] }}</td>
        </slot>
      </tr>
    </tbody>

    <tbody v-else>
      <tr v-for="(item, index) of sortedData" @dblclick.stop.prevent.capture="emit('rowDoubleClicked', item)" @click="rowClicked(index, item)" :class="{ highlighted: selectedRow === index }">
        <slot :name="column.key" :item="item" v-for="column of columns">
          <td>{{ item[column.key] }}</td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>