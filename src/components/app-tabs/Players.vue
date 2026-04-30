<script setup lang="ts">
import { loadPlayers, players } from '@/state/players';
import { computed, nextTick, onActivated } from 'vue';
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

//const progressTooltip = `Visiting this tab while this box is checked will send the "!status" command in chat in order to get player completion progress.`;
const progressTooltip = `Requires automatically sending the !status command. It won't show in your chat, but other players may see it.`;

const filteredPlayers = computed(() => {
  // Remove the "Archipelago" player
  return players.value.filter(player => player.name !== 'Archipelago');
});
</script>

<template>
  <div class="players">
    <div class="checks">
      <div class="check-row">
        <input @input="onShowPlayerProgress" v-model="settings.showPlayerProgress" type="checkbox" id="showPlayerProgress">
        <label for="showPlayerProgress">Show player progress</label>
        <!-- <label :data-tippy-content="progressTooltip" data-tippy-placement="bottom" for="showPlayerProgress">Show player progress</label> -->
      </div>
      <div v-if="settings.showPlayerProgress" class="check-row" :class="{ disabled: !settings.showPlayerProgress }">
        <input @input="onShowPlayerProgress" v-model="settings.showPlayerDecimal" type="checkbox" id="showPlayerDecimal">
        <label for="showPlayerDecimal">Use precise progress</label>
      </div>
      <div v-if="settings.showPlayerProgress" class="check-row" :class="{ disabled: !settings.showPlayerProgress }">
        <input @input="onShowPlayerProgress" v-model="settings.showPlayerCheckCount" type="checkbox" id="showPlayerChecksCount">
        <label for="showPlayerChecksCount">Show checks count</label>
      </div>
    </div>
    <div class="sunken-panel">
      <div v-if="players.length === 0">
        <p class="loading">Loading players...</p>
      </div>
      <AppTable v-else :columns="settings.showPlayerProgress ? columnsWithProgress : columns" :data="filteredPlayers" default-sort-by="status">
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
            <span v-if="!settings.showPlayerDecimal" style="font-family: monospace !important; width: 3em; display: inline-block; text-align: right;">
              {{ item.progress }}%
            </span>
            <span v-else style="font-family: monospace !important; width: 4em; display: inline-block; text-align: right;">
              {{ item.progressTwoDecimal }}%
            </span>
            <progress :value="item.progress" max="100" style="vertical-align: middle; margin-left: 0.5em; margin-right: 0.5em;"></progress>
            <span v-if="settings.showPlayerCheckCount">({{ item.progressCollected }} / {{ item.progressTotal }})</span>
          </td>
          <td style="font-family: monospace !important; text-align: center;" v-else>N/a</td>
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

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.checks {
  display: flex;
  gap: 1em;
  margin-top: 0.5em;
  flex-wrap: wrap;
}
</style>