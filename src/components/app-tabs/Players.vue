<script setup lang="ts">
import { loadPlayers, players } from '@/state/players';
import { nextTick, onActivated } from 'vue';
import AppTable, { type Column } from '@/components/AppTable.vue';
import PlayerName from '../text-elements/PlayerName.vue';
import { settings } from '@/state/settings';
import { client } from '@/lib/archipelago';

onActivated(async () => {
  if (settings.value.showPlayerProgress) client.messages.say('!status').catch(() => {});

  loadPlayers();
});

async function onShowPlayerProgress(e: Event) {
  const element = e.target as HTMLInputElement;
  if (element.checked) {
    client.messages.say('!status').catch(() => {});
  }
}

const columns: Column[] = [
  { label: 'Team', key: 'team' },
  { label: 'Name', key: 'name' },
  { label: 'Status', key: 'status' },
  { label: 'Game', key: 'game' }
];

const columnsWithProgress: Column[] = [
  { label: 'Team', key: 'team' },
  { label: 'Name', key: 'name' },
  { label: 'Progress', key: 'progress' },
  { label: 'Status', key: 'status' },
  { label: 'Game', key: 'game' }
];

const progressTooltip = `Visiting this tab while this box is checked will send the "!status" command in chat in order to get player completion progress.`;
</script>

<template>
  <div class="players">
    <div class="check-row" style="margin: 0.5em 0;">
      <input @input="onShowPlayerProgress" v-model="settings.showPlayerProgress" type="checkbox" id="showPlayerProgress">
      <label :data-tippy-content="progressTooltip" data-tippy-placement="right" for="showPlayerProgress">Show player progress</label>
    </div>
    <div class="sunken-panel">
      <div v-if="players.length === 0">
        <p class="loading">Loading players...</p>
      </div>
      <AppTable v-else :columns="settings.showPlayerProgress ? columnsWithProgress : columns" :data="players" default-sort-by="status">
        <template #team="{ item }">
          <td style="text-align: center">{{ item.team + 1 }}</td>
        </template>

        <template #name="{ item }">
          <td><PlayerName :alias="item.name" :slot="item.slot" :game="item.game" /></td>
        </template>

        <template #status="{ item }">
          <td><span :class="[item.status]">{{ item.status }}</span></td>
        </template>

        <template #progress="{ item }">
          <td v-if="typeof item.progress === 'number'">
            <span style="font-family: monospace !important; width: 3em; display: inline-block;">{{ item.progress }}%</span>
            <progress :value="item.progress" max="100" style="vertical-align: middle; margin-left: 0.5em;"></progress>
          </td>
          <td style="font-family: monospace !important;" v-else>N/a</td>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped>
.players {
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
}

.sunken-panel {
  flex: 1;
}

td {
  padding: 0.5em;
}

.Disconnected {
  color: red;
  font-weight: bold;
}

.Completed {
  color: blue;
  font-weight: bold;
}

.Connected {
  color: green;
  font-weight: bold;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  opacity: 0.8;
  pointer-events: none;
  user-select: none;
}
</style>