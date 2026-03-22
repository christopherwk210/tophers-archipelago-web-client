<script setup lang="ts">
import { localAccounts, type Account } from '@/lib/accounts';
import { AppStorage } from '@/lib/storage';
import { ui } from '@/state/ui';
import { computed, ref, watch } from 'vue';

const url = ref('');
const slot = ref('');
const password = ref('');
const showPassword = ref(false);

const addMode = computed(() => ui.modals.editAccount === true);

watch(() => ui.modals.editAccount, account => {
  if (!ui.modals.editAccount) return;

  if (account === true) {
    url.value = AppStorage.get('url') || '';
    slot.value = AppStorage.get('slot') || '';
    password.value = AppStorage.get('password') || '';
  } else if (account) {
    url.value = account.url;
    slot.value = account.slot;
    password.value = account.password || '';
  } else {
    url.value = '';
    slot.value = '';
    password.value = '';
  }
});

function add() {
  if (addMode.value) {
    if (localAccounts.value.some(a => a.url === url.value && a.slot === slot.value)) {
      alert('An account with that URL and slot already exists.');
      return;
    }
  
    localAccounts.value = [...localAccounts.value, { url: url.value, slot: slot.value, password: password.value }];
  } else {
    const editingAccount = ui.modals.editAccount as Account;
    const existingIndex = localAccounts.value.findIndex(a => a.url === editingAccount.url && a.slot === editingAccount.slot);
    if (existingIndex !== -1) {
      localAccounts.value[existingIndex] = { url: url.value, slot: slot.value, password: password.value };
    }
  }

  ui.modals.editAccount = undefined;
}
</script>

<template>
  <div class="edit-account-modal" v-if="ui.modals.editAccount">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">{{ addMode ? 'Add Account' : 'Edit Account' }}</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="ui.modals.editAccount = undefined"></button>
        </div>
      </div>
      <div class="window-body">
        <div class="field-row-stacked">
          <label for="url">URL</label>
          <input v-model="url" id="url" type="text" placeholder="archipelago.gg:12345" spellcheck="false" autocomplete="off" autocapitalize="none" />
        </div>
        <div class="mt-3 field-row-stacked">
          <label for="name">Name/Slot</label>
          <input v-model="slot" id="name" type="text" spellcheck="false" autocomplete="off" autocapitalize="none" />
        </div>
        <div class="mt-3 field-row-stacked">
          <label for="password">Password</label>
          <input placeholder="Leave blank if no password is needed" v-model="password" id="password" :type="showPassword ? 'text' : 'password'" spellcheck="false" autocomplete="off" autocapitalize="none" />
        </div>
        <div class="mt-1 field-row-stacked">
          <!-- show password checkbox -->
          <input v-model="showPassword" type="checkbox" id="show-password">
          <label for="show-password">Show Password</label>
        </div>

        <div style="display: flex; justify-content: center; gap: 1em; margin-top: 1em">
          <button @click="add()">{{ addMode ? 'Add' : 'Save' }}</button>
          <button @click="ui.modals.editAccount = undefined">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-account-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;

  display: flex;
  justify-content: center;
  align-items: center;

  backdrop-filter: grayscale(1);
}

.window {
  width: 100%;
  max-width: 400px;
}

.window-body button {
  padding: 0.5em 1em;
}
</style>