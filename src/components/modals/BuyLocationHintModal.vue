<script setup lang="ts">
import { appTabManager, AppTab } from '@/state/tabs';
import { ui } from '@/state/ui';
import { sendMessage } from '@/state/chat';
import { hints } from '@/state/hints';

function purchase() {
  if (!ui.modals.buyLocationHint) return;

  appTabManager.currentTabIndex.value = AppTab.CHAT;
  sendMessage(`!hint_location ${ui.modals.buyLocationHint.name}`);
  ui.modals.buyLocationHint = undefined;
}
</script>

<template>
  <div class="modal buy-item-hint" v-if="ui.modals.buyLocationHint">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">Buy location hint</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="ui.modals.buyLocationHint = undefined"></button>
        </div>
      </div>
      <div class="window-body">
        <div style="margin-bottom: 0.5em;">
          You are about to purchase a location hint for:
        </div>

        <strong>{{ ui.modals.buyLocationHint.name }}</strong>

        <div style="margin: 1em 0; font-size: 0.875em">
          <div>Hint cost: {{ hints.cost }}</div>
          <div>Available points: {{ hints.points }}</div>
        </div>

        <div style="display: flex; justify-content: center;">
          <button :disabled="hints.points < hints.cost" @click="purchase">Purchase</button>
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