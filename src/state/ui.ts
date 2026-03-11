import { reactive } from 'vue';
import type { TrackerLocation } from './tracker';
import type { Account } from '@/lib/accounts';

export const ui = reactive({
  modals: {
    buyItemHint: false,
    editAccount: undefined as Account | undefined | true,
    buyLocationHint: undefined as TrackerLocation | undefined,
    exportTheme: false as false | string
  }
});