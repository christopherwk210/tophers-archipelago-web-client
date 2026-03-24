<script setup lang="ts">
import { client } from '@/lib/archipelago';
import { appTabManager, AppTab } from '@/state/tabs';
import { ui } from '@/state/ui';
import { ref, watch } from 'vue';
import { sendMessage } from '@/state/chat';
import { hints } from '@/state/hints';

const items = ref<string[]>([]);
const selectedItem = ref<string | null>(null);

watch(() => ui.modals.buyItemHint, () => {
  if (!ui.modals.buyItemHint) return;
  
  // Find the package for the current user
  const pkg = client.package.findPackage(client.players.self.game);
  if (!pkg) {
    ui.modals.buyItemHint = false;
    return;
  }

  // Sort the items list and apply to UI
  items.value = Object.keys(pkg.itemTable).sort();
  selectedItem.value = items.value[0] || null;
});

function purchase() {
  appTabManager.currentTabIndex.value = AppTab.CHAT;
  sendMessage(`!hint ${selectedItem.value}`);
  ui.modals.buyItemHint = false;
}
</script>

<template>
  <div class="modal buy-item-hint" v-if="ui.modals.buyItemHint">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">Buy item hint</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="ui.modals.buyItemHint = false"></button>
        </div>
      </div>
      <div class="window-body">
        <div style="margin-bottom: 0.2em">Item:</div>
        <select v-model="selectedItem">
          <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
        </select>

        <div style="margin: 1em 0; font-size: 0.875em">
          <div>Hint cost: {{ hints.cost }}</div>
          <div>Available points: {{ hints.points }}</div>
        </div>

        <div style="display: flex; justify-content: center;">
          <button @click="purchase">Purchase</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buy-item-hint {
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

select {
  width: 100%;
}
</style>