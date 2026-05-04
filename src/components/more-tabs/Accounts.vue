<script setup lang="ts">
import AppTable, { type Column } from '@/components/AppTable.vue';
import { localAccounts, type Account } from '@/lib/accounts';
import { ref } from 'vue';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';
import { ui } from '@/state/ui';
import { useLocalization } from '@/lib/localization-util';

const { t } = useLocalization();

const columns: Column[] = [
  { label: t('Accounts.accountsSlot'), key: 'slot' },
  { label: t('Accounts.accountsUrl'), key: 'url' }
];

const selectedAccount = ref<Account>();

function deleteAccount() {
  if (!selectedAccount.value) return;

  const proceed = confirm(t('Accounts.accountsDeleteConfirm', { slot: selectedAccount.value.slot }));

  if (proceed) {
    localAccounts.value = localAccounts.value.filter(a => a !== selectedAccount.value);
    selectedAccount.value = undefined;
  }
}

function deleteAll() {
  const proceed = confirm(t('Accounts.accountsDeleteAllConfirm'));

  if (proceed) {
    localAccounts.value = [];
    selectedAccount.value = undefined;
  }
}
</script>

<template>
  <div class="inner-container">
    <div style="display: flex; gap: 1em; font-size: 0.875em;">
      <button style="margin-right: auto" @click="ui.modals.editAccount = true">{{ t('Accounts.accountsAddAccountEllipses') }}</button>
      <button :disabled="!selectedAccount" @click="ui.modals.editAccount = selectedAccount">{{ t('Accounts.accountsEdit') }}</button>
      <button :disabled="!selectedAccount" @click="deleteAccount">{{ t('Accounts.accountsDelete') }}</button>
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
    <div style="display: flex; gap: 1em; font-size: 0.875em;">
      <div style="margin-right: auto"></div>
      <button :disabled="localAccounts.length === 0" @click="deleteAll">{{ t('Accounts.accountsDeleteAll') }}</button>
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
  padding: 0 !important;
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