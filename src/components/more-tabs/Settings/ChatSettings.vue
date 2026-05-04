<script setup lang="ts">
import { BitField } from '@/lib/bit-field';
import { useLocalization } from '@/lib/localization-util';
import { chatFilterHasFlag, ChatFilterFlag, settings } from '@/state/settings';
import { computed, type ComputedRef, type WritableComputedRef } from 'vue';

const { t } = useLocalization();

type ChatFilterFlagInfo = {
  name: ComputedRef<string>;
  flag: WritableComputedRef<boolean, boolean>;
  tooltip?: ComputedRef<string>;
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
    name: computed(() => t('Settings.settingsChatPlayerMessages')),
    flag: createComputedFlag(ChatFilterFlag.PLAYER_CHAT),
    tooltip: computed(() => t('Settings.settingsChatPlayerMessagesTooltip'))
  },
  {
    name: computed(() => t('Settings.settingsChatTutorialMessages')),
    flag: createComputedFlag(ChatFilterFlag.TUTORIAL),
  },
  {
    name: computed(() => t('Settings.settingsChatItemSent')),
    flag: createComputedFlag(ChatFilterFlag.ITEM_SENT),
  },
  {
    name: computed(() => t('Settings.settingsChatItemHinted')),
    flag: createComputedFlag(ChatFilterFlag.ITEM_HINTED),
  },
  {
    name: computed(() => t('Settings.settingsChatPlayerGoaled')),
    flag: createComputedFlag(ChatFilterFlag.GOALED),
  },
  {
    name: computed(() => t('Settings.settingsChatPlayerConnected')),
    flag: createComputedFlag(ChatFilterFlag.CONNECTED),
  },
  {
    name: computed(() => t('Settings.settingsChatPlayerDisconnected')),
    flag: createComputedFlag(ChatFilterFlag.DISCONNECTED),
  },
  {
    name: computed(() => t('Settings.settingsChatPlayerChangedTags')),
    flag: createComputedFlag(ChatFilterFlag.TAG_CHANGE),
  },
  {
    name: computed(() => t('Settings.settingsChatDeathLinkMessages')),
    flag: createComputedFlag(ChatFilterFlag.DEATH_LINK),
  },
  {
    name: computed(() => t('Settings.settingsChatUnclassified')),
    flag: createComputedFlag(ChatFilterFlag.UNCLASSIFIED),
    tooltip: computed(() => t('Settings.settingsChatUnclassifiedTooltip'))
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
    <legend><strong>{{ t('Settings.settingsChat') }}</strong></legend>
    <label>{{ t('Settings.settingsChatOnlyShow') }}</label>
    <div class="chat-filter-grid">
      <div v-for="item of filterFlagMap">
        <input v-model="item.flag.value" type="checkbox" :id="item.name.value">
        <label :data-tippy-content="item.tooltip" :for="item.name.value">{{ item.name }}</label>
      </div>
    </div>
    <div class="select-btn-row">
      <button @click="selectAll()">{{ t('Settings.settingsChatSelectAll') }}</button>
      <button @click="selectNone()">{{ t('Settings.settingsChatSelectNone') }}</button>
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

.chat-filter-grid label {
  line-height: 1.1;
}

.select-btn-row {
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
</style>