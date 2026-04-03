<script setup lang="ts">
import { computed, onActivated } from 'vue';
import check from '@/assets/icons/check.png';
import minus from '@/assets/icons/minus.png';
import { showMouseToast, ui } from '@/state/ui';
import { hints, loadHints, type LocalHint } from '@/state/hints';
import AppTable, { type Column } from '@/components/AppTable.vue';
import { settings } from '@/state/settings';
import PlayerName from '../text-elements/PlayerName.vue';
import ItemName from '../text-elements/ItemName.vue';

onActivated(async () => {
  loadHints();
});

const columns: Column[] = [
  { label: 'Found', key: 'found' },
  { label: 'Player', key: 'player' },
  { label: 'Item', key: 'item' },
  { label: 'Owner', key: 'owner' },
  { label: 'Location', key: 'location' }
];

const computedColumns = computed(() => {
  if (settings.value.hintCopyButtonEnabled) {
    return [{ label: '', key: 'actions', style: 'width: 30px' }, ...columns];
  }

  return columns;
})

const filteredHints = computed(() => {
  if (settings.value.hintsFilterFound) {
    return hints.list.filter(hint => !hint.found);
  }
  return hints.list;
});

async function copyHint(item: LocalHint) {
  showMouseToast('Hint copied to clipboard');

  let result: boolean | void;
  switch (settings.value.hintCopyType) {
    case 'markdown':
      result = await navigator.clipboard.writeText(`\`${item.player}\`'s __${item.item}__ is in \`${item.owner}\`'s world at **${item.location}**`).catch(() => false);
      break;
    case 'plain':
      result = await navigator.clipboard.writeText(`${item.player}'s ${item.item} is in ${item.owner}'s world at ${item.location}`).catch(() => false);
      break;
    case 'item-name':
      result = await navigator.clipboard.writeText(item.item).catch(() => false);
      break;
    case 'ascii':
      result = await navigator.clipboard.writeText(`(╯°□°)╯ <( ${item.owner.toUpperCase()} YOU HAVE MY ${item.item.toUpperCase()} AND I NEED IT )`).catch(() => false);
      break;
  }

  if (result === false) {
    showMouseToast('Failed to copy hint');
  } else {
    showMouseToast('Hint copied to clipboard');
  }
}
</script>

<template>
  <div class="hints">
    <div class="actions">
      <button :disabled="hints.points < hints.cost" @click="ui.modals.buyItemHint = true">Buy item hint</button>
      <div class="check-row" style="margin: 0.5em 0;">
        <input v-model="settings.hintsFilterFound" type="checkbox" id="filterFound">
        <label for="filterFound">Hide found hints</label>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 0.875em;">
      <span>Hint cost: {{ hints.cost }}</span>
      <span>Available points: {{ hints.points }}</span>
    </div>
    <div class="sunken-panel">
      <AppTable :columns="computedColumns" :data="filteredHints" default-sort-by="player" @rowDoubleClicked="e => copyHint(e)">
        <template #actions="{ item }">
          <td>
            <button @click.prevent.stop="e => copyHint(item)" class="copy-btn">
              <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m6 18h-3c-.48 0-1-.379-1-1v-14c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v3h3c.621 0 1 .522 1 1v14c0 .621-.522 1-1 1h-14c-.48 0-1-.379-1-1zm1.5-10.5v13h13v-13zm9-1.5v-2.5h-13v13h2.5v-9.5c0-.481.38-1 1-1z" fill-rule="nonzero"/></svg>
            </button>
          </td>
        </template>

        <template #found="{ item }">
          <td style="text-align: center"><img :src="item.found ? check : minus"></td>
        </template>

        <template #player="{ item }">
          <td><PlayerName :alias="item.player" :slot="item.slot" :game="item.game" /></td>
        </template>

        <template #owner="{ item }">
          <td><PlayerName :alias="item.owner" :slot="item.ownerSlot" :game="item.ownerGame" /></td>
        </template>

        <template #item="{ item }">
          <td><ItemName :iclass="item.itemClass" :name="item.item" /></td>
        </template>

        <template #location="{ item }">
          <td style="color: var(--theme-location)">{{ item.location }}</td>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
.hints {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
}

.sunken-panel {
  flex: 1;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.copy-btn {
  margin: 2px;
  padding: 8px;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
}

.copy-btn svg {
  width: 1.2em;
  height: 1.2em;
}
</style>