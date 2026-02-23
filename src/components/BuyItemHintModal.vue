<script setup lang="ts">
import { client } from '@/archipelago';
import { state, appTabs } from '@/state';
import { ref, watch } from 'vue';

const items = ref<string[]>([]);

watch(() => state.value.buyingItemHint, () => {
  if (state.value.buyingItemHint) {
    const pkg = client.package.findPackage(client.players.self.game);
    if (!pkg) {
      state.value.buyingItemHint = false;
      return;
    }

    items.value = Object.keys(pkg.itemTable);
    selectedItem.value = items.value[0] || null;
  }
});

const selectedItem = ref<string | null>(null);

function purchase() {
  appTabs.value.selectedTabIndex = 0;
  client.messages.say(`!hint ${selectedItem.value}`);
  state.value.buyingItemHint = false;
}
</script>

<template>
  <div class="buy-item-hint" v-if="state.buyingItemHint">
    <div class="window">
      <div class="title-bar">
        <div class="title-bar-text">Buy item hint</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="state.buyingItemHint = false"></button>
        </div>
      </div>
      <div class="window-body">
        <div style="margin-bottom: 0.2em">Item:</div>
        <select v-model="selectedItem">
          <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
        </select>

        <div style="margin: 1em 0; font-size: 14px">
          <div>Hint cost: {{ state.hintCost }}</div>
          <div>Available points: {{ state.hintPoints }}</div>
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