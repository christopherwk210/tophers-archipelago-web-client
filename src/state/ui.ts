import { reactive } from 'vue';
import type { TrackerLocation } from './tracker';
import type { Account } from '@/lib/accounts';

export const ui = reactive({
  design: {
    windowOpen: false
  },
  modals: {
    buyItemHint: false,
    editAccount: undefined as Account | undefined | true,
    buyLocationHint: undefined as TrackerLocation | undefined,
    exportTheme: false as false | string
  },
  mouseToast: {
    visible: false,
    timer: 0,
    content: '',
    id: 0
  }
});

export function showMouseToast(content: string, duration = 1500) {
  ui.mouseToast.content = content;
  ui.mouseToast.visible = true;
  ui.mouseToast.id++;

  clearTimeout(ui.mouseToast.timer);
  ui.mouseToast.timer = setTimeout(() => {
    ui.mouseToast.visible = false;
  }, duration);
}