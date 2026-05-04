<script setup lang="ts">
import { BitField } from '@/lib/bit-field';
import { useLocalization } from '@/lib/localization-util';
import { chatFilterHasFlag, ChatFilterFlag, settings } from '@/state/settings';
import { computed, type WritableComputedRef } from 'vue';

const { t } = useLocalization();

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
    name: t('Settings.settingsChatPlayerMessages')!,
    flag: createComputedFlag(ChatFilterFlag.PLAYER_CHAT),
    tooltip: t('Settings.settingsChatPlayerMessagesTooltip')!
  },
  {
    name: t('Settings.settingsChatTutorialMessages')!,
    flag: createComputedFlag(ChatFilterFlag.TUTORIAL),
  },
  {
    name: t('Settings.settingsChatItemSent')!,
    flag: createComputedFlag(ChatFilterFlag.ITEM_SENT),
  },
  {
    name: t('Settings.settingsChatItemHinted')!,
    flag: createComputedFlag(ChatFilterFlag.ITEM_HINTED),
  },
  {
    name: t('Settings.settingsChatPlayerGoaled')!,
    flag: createComputedFlag(ChatFilterFlag.GOALED),
  },
  {
    name: t('Settings.settingsChatPlayerConnected')!,
    flag: createComputedFlag(ChatFilterFlag.CONNECTED),
  },
  {
    name: t('Settings.settingsChatPlayerDisconnected')!,
    flag: createComputedFlag(ChatFilterFlag.DISCONNECTED),
  },
  {
    name: t('Settings.settingsChatPlayerChangedTags')!,
    flag: createComputedFlag(ChatFilterFlag.TAG_CHANGE),
  },
  {
    name: t('Settings.settingsChatDeathLinkMessages')!,
    flag: createComputedFlag(ChatFilterFlag.DEATH_LINK),
  },
  {
    name: t('Settings.settingsChatUnclassified')!,
    flag: createComputedFlag(ChatFilterFlag.UNCLASSIFIED),
    tooltip: t('Settings.settingsChatUnclassifiedTooltip')!
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