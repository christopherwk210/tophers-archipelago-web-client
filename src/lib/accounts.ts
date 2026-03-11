import { ref, watch } from 'vue';
import { AppStorage } from './storage';

export interface Account {
  slot: string;
  url: string;
  password?: string;
}

export function getAccounts(): Account[] {
  return AppStorage.getJSON<Account[]>('accounts') || [];
}

export function setAccounts(accounts: Account[]) {
  AppStorage.setJSON('accounts', accounts);
}

export const localAccounts = ref<Account[]>(getAccounts());

watch(localAccounts, (newAccounts) => {
  setAccounts(newAccounts);
}, { deep: true });