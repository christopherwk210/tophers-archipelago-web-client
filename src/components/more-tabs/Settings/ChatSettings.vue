<script setup lang="ts">
import { BitField } from '@/lib/bit-field';
import { chatFilterHasFlag, ChatFilterFlag, settings } from '@/state/settings';
import { computed, type WritableComputedRef } from 'vue';

type ChatFilterFlagInfo = {
  name: string;
  flag: WritableComputedRef<boolean, boolean>;
  tooltip?: string;
}

function createComputedFlag(flag: ChatFilterFlag) {
  return computed<boolean>({
    get: () => !chatFilterHasFlag(flag),
    set: (val: boolean) => {
      const filterFlags = new BitField<ChatFilterFlag>(settings.value.chatFilterFlags);

      if (val) {
        filterFlags.remove(flag);
      } else {
        filterFlags.add(flag);
      }

      settings.value.chatFilterFlags = filterFlags.value;
    }
  });
}

const filterFlagMap: ChatFilterFlagInfo[] = [
  {
    name: 'Player Messages',
    flag: createComputedFlag(ChatFilterFlag.PLAYER_CHAT),
    tooltip: 'All user chat messages, even your own!'
  },
  {
    name: 'Tutorial Messages',
    flag: createComputedFlag(ChatFilterFlag.TUTORIAL),
  },
  {
    name: 'Item Sent',
    flag: createComputedFlag(ChatFilterFlag.ITEM_SENT),
  },
  {
    name: 'Item Hinted',
    flag: createComputedFlag(ChatFilterFlag.ITEM_HINTED),
  },
  {
    name: 'Player Goaled',
    flag: createComputedFlag(ChatFilterFlag.GOALED),
  },
  {
    name: 'Player Connected',
    flag: createComputedFlag(ChatFilterFlag.CONNECTED),
  },
  {
    name: 'Player Disconnected',
    flag: createComputedFlag(ChatFilterFlag.DISCONNECTED),
  },
  {
    name: 'Player Changed Tags',
    flag: createComputedFlag(ChatFilterFlag.TAG_CHANGE),
  },
  {
    name: 'Death Link Messages',
    flag: createComputedFlag(ChatFilterFlag.DEATH_LINK),
  },
  {
    name: 'Unclassified',
    flag: createComputedFlag(ChatFilterFlag.UNCLASSIFIED),
    tooltip: 'Messages that don\'t fit any other category'
  }
];

function selectAll() {
  filterFlagMap.forEach(item => {
    item.flag.value = true;
  });
}

function selectNone() {
  filterFlagMap.forEach(item => {
    item.flag.value = false;
  });
}
</script>

<template>
  <fieldset class="mt-3">
    <legend><strong>Chat</strong></legend>
    <label>Only show these kinds messages:</label>
    <div class="chat-filter-grid">
      <div v-for="item of filterFlagMap">
        <input v-model="item.flag.value" type="checkbox" :id="item.name">
        <label :data-tippy-content="item.tooltip" :for="item.name">{{ item.name }}</label>
      </div>
    </div>
    <div class="select-btn-row">
      <button @click="selectAll()">Select all</button>
      <button @click="selectNone()">Select none</button>
    </div>
  </fieldset>
</template>

<style scoped>
.chat-filter-grid {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  margin-top: 1em;
}

.chat-filter-grid > * {
  width: 200px;
}

.select-btn-row {
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
</style>