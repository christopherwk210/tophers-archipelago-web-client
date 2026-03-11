<script setup lang="ts">
import AppTable, { type Column } from '@/components/AppTable.vue';
import { localAccounts, type Account } from '@/lib/accounts';
import { ref } from 'vue';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';
import { ui } from '@/state/ui';

const columns: Column[] = [
  { label: 'Slot', key: 'slot' },
  { label: 'Url', key: 'url' },
  // { label: 'Has Password', key: 'password', style: 'width: 150px;' }
];

const selectedAccount = ref<Account>();

function deleteAccount() {
  if (!selectedAccount.value) return;

  const proceed = confirm(`Are you sure you want to delete "${selectedAccount.value.slot}"?`);

  if (proceed) {
    localAccounts.value = localAccounts.value.filter(a => a !== selectedAccount.value);
    selectedAccount.value = undefined;
  }
}
</script>

<template>
  <div class="inner-container">
    <div style="display: flex; gap: 1em; font-size: 0.875em;">
      <button style="margin-right: auto" @click="ui.modals.editAccount = true">Add account...</button>
      <button :disabled="!selectedAccount" @click="ui.modals.editAccount = selectedAccount">Edit</button>
      <button :disabled="!selectedAccount" @click="deleteAccount">Delete</button>
    </div>
    <div class="sunken-panel">
      <AppTable :columns="columns" :data="localAccounts" default-sort-by="slot" @row-selected="selectedAccount = $event">
        <template #password="{ item }">
          <td style="text-align: center"><img :src="item.password ? check : minus"></td>
        </template>

        <template #label="{ item }">
          <td :style="item.label ? {} : { color: 'gray' }">{{ item.label ? item.label : 'No Label' }}</td>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
.inner-container {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
}

.sunken-panel {
  flex: 1;
}

button {
  padding: 0.5em 1em;
}

:deep(td) {
  padding: 1em;
}
</style>