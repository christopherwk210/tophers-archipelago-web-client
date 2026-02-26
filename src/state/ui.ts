import { reactive } from 'vue';
import type { TrackerLocation } from './tracker';

export const ui = reactive({
  modals: {
    buyItemHint: false,
    buyLocationHint: undefined as TrackerLocation | undefined
  }
});